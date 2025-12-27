import { makeViews, type IArrayBufferViews } from "$lib/common/arrayBufferViews";
import { base64ToUint8Array, uint8ArrayToBase64 } from "$lib/common/base64Helper";
import { JavaByteArrayInputStream } from "$lib/java/ByteArrayInputStream";
import { JavaByteArrayOutputStream } from "$lib/java/ByteArrayOutputStream";
import { JavaDataInputStream } from "$lib/java/DataInputStream";
import { JavaDataOutputStream } from "$lib/java/DataOutputStream";
import { JavaRandom } from "../java/Random";

const HEADER: string = "Tfr=";
const B64_HEADER: string = "This data is encoded by Textfuscator. " +
 "Data here cannot be decoded unless decoded by Textfuscator.";
export const MAJOR_VERSION: number = 0x01;
export const MINOR_VERSION: number = 0x00;

export type Mode = "XOR" | "AES_GCM" | "AES_GCM_PBKDF2";
export interface IKeyInputPair {
    key: string,
    input: string,
    mode: Mode,
    compressed: boolean
};

export const DEFAULT_MAX_MEMORY_SIZE: number = 1024 * 1024; // 1 MiB
export const DEFAULT_MEMORY_SIZE: number = 1024; // 1 KiB
let arrayBuffer = new ArrayBuffer(DEFAULT_MEMORY_SIZE, { maxByteLength: DEFAULT_MAX_MEMORY_SIZE });
let arrayBufferViews = makeViews(arrayBuffer);

const isUsingFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
let warnedUsingFirefox = false;

export function setMaxMemoryBufferSize(size: number): void {
    if (size != arrayBuffer.maxByteLength) {
        if (arrayBufferViews !== null) {
            arrayBufferViews.dataView = null as unknown as DataView;
            arrayBufferViews.uint8View = null as unknown as Uint8Array;
        }
        arrayBufferViews = null as unknown as IArrayBufferViews;
        arrayBuffer.resize(0);
        arrayBuffer = new ArrayBuffer(DEFAULT_MEMORY_SIZE, { maxByteLength: size });
        arrayBufferViews = makeViews(arrayBuffer);
        console.log("Resized Textfuscator memory buffer to " + String(size) + " bytes");

        if (isUsingFirefox && !warnedUsingFirefox) {
            alert("You are using Firefox. " + 
                "Resizing may allocate the maximum buffer size instead of the minimum size, " + 
                "which can affect performance or memory usage. To save memory, consider using Chrome or Edge.");
            warnedUsingFirefox = true;
        }
    }
}

let decodeVersionChecking: boolean = true;
export function setDecodeVersionChecking(value: boolean) {
    decodeVersionChecking = value;
}

function getModeByte(mode: Mode): number {
    switch (mode) {
        case "XOR": return 0;
        case "AES_GCM": return 1;
        case "AES_GCM_PBKDF2": return 2;
        default: throw TypeError("Invalid mode: " + mode);
    }
}

function getModeFromByte(modeByte: number): (Mode | null) {
    switch (modeByte) {
        case 0: return "XOR";
        case 1: return "AES_GCM";
        case 2: return "AES_GCM_PBKDF2";
        default: return null;
    }
}

async function compressGzip(data: ArrayBuffer): Promise<ArrayBuffer> {
    const blob = new Blob([data]);
    const stream: ReadableStream = blob.stream();

    const compressedStream = stream.pipeThrough(new CompressionStream("gzip"));

    const response = new Response(compressedStream);
    return await response.arrayBuffer();
}

async function decompressGzip(data: ArrayBuffer): Promise<ArrayBuffer> {
    const blob = new Blob([data]);
    const stream = blob.stream(); 

    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));

    const response = new Response(decompressedStream);
    return await response.arrayBuffer();
}

async function encodeBlockXor(keyInputPair: IKeyInputPair,
    keyHash: ArrayBuffer, dataStream: JavaDataOutputStream) {
    const input: string = keyInputPair.input;
    let dataBuffer: ArrayBuffer = new TextEncoder().encode(input).buffer;
    let data: Uint8Array = new Uint8Array(dataBuffer);

    if (keyInputPair.compressed) {
        const compressedData = await compressGzip(dataBuffer);
        dataBuffer = compressedData;
        data = new Uint8Array(compressedData);
    }
    
    const keyBufferView: DataView = new DataView(keyHash);
    const publicSeed1: bigint = keyBufferView.getBigInt64(0);
    const publicSeed2: bigint = keyBufferView.getBigInt64(8);
    const privateSeed1: bigint = keyBufferView.getBigInt64(16);
    const privateSeed2: bigint = keyBufferView.getBigInt64(24);
    const random: JavaRandom = new JavaRandom(privateSeed1 ^ privateSeed2);

    const xorData: Uint8Array = new Uint8Array(data.length);
    random.nextUnsignedBytes(xorData);

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i] ^ xorData[i];
    }

    dataStream.writeLong(publicSeed1);
    dataStream.writeLong(publicSeed2);
    dataStream.writeByte(getModeByte("XOR"));
    dataStream.writeBoolean(keyInputPair.compressed);
    dataStream.writeInt(data.length);
    dataStream.writeBytes(data);
}

async function encodeBlockAesGcm(keyInputPair: IKeyInputPair,
    keyHash: ArrayBuffer, dataStream: JavaDataOutputStream) {
    const input: string = keyInputPair.input;

    let dataBuffer: ArrayBuffer = new TextEncoder().encode(input).buffer;
    let data: Uint8Array = new Uint8Array(dataBuffer);

    if (keyInputPair.compressed) {
        const compressedData = await compressGzip(dataBuffer);
        dataBuffer = compressedData;
        data = new Uint8Array(compressedData);
    }

    const nonce: Uint8Array<ArrayBuffer> = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.importKey("raw", keyHash, { name: "AES-GCM" }, false, ["encrypt"]);
    const keyBufferView: DataView = new DataView(keyHash);
    const keyHashWritten1: bigint = keyBufferView.getBigInt64(0);
    const keyHashWritten2: bigint = keyBufferView.getBigInt64(8);

    const aadView = new DataView(new ArrayBuffer(16));
    aadView.setBigInt64(0, keyHashWritten1);
    aadView.setBigInt64(8, keyHashWritten2);

    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, additionalData: aadView.buffer, tagLength: 128 },
         key, dataBuffer);

    const encryptedBytes = new Uint8Array(encryptedData);

    dataStream.writeLong(keyHashWritten1);
    dataStream.writeLong(keyHashWritten2);
    dataStream.writeByte(getModeByte("AES_GCM"));
    dataStream.writeBoolean(keyInputPair.compressed);

    const payloadStream = new JavaByteArrayOutputStream(new ArrayBuffer(nonce.length + 4 + encryptedBytes.length));
    const payloadDataStream = new JavaDataOutputStream(payloadStream);
    payloadDataStream.writeBytes(nonce);
    payloadDataStream.writeInt(encryptedBytes.length);
    payloadDataStream.writeBytes(encryptedBytes);

    const payloadBuffer = payloadStream.toArrayBuffer();
    dataStream.writeInt(payloadBuffer.byteLength);
    dataStream.writeBytes(new Uint8Array(payloadBuffer));
    payloadDataStream.close();
    payloadStream.close();
}

async function encodeBlockAesGcmPBKDF2(keyInputPair: IKeyInputPair,
    keyHash: ArrayBuffer, dataStream: JavaDataOutputStream) {
    const input: string = keyInputPair.input;

    let dataBuffer: ArrayBuffer = new TextEncoder().encode(input).buffer;
    let data: Uint8Array = new Uint8Array(dataBuffer);

    if (keyInputPair.compressed) {
        const compressedData = await compressGzip(dataBuffer);
        dataBuffer = compressedData;
        data = new Uint8Array(compressedData);
    }

    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    const baseKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(keyInputPair.key),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const nonce: Uint8Array<ArrayBuffer> = crypto.getRandomValues(new Uint8Array(12));
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 600000,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
    );
    const keyBufferView: DataView = new DataView(keyHash);
    const keyHashWritten1: bigint = keyBufferView.getBigInt64(0);
    const keyHashWritten2: bigint = keyBufferView.getBigInt64(8);

    const aadView = new DataView(new ArrayBuffer(16));
    aadView.setBigInt64(0, keyHashWritten1);
    aadView.setBigInt64(8, keyHashWritten2);

    const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce, additionalData: aadView.buffer, tagLength: 128 },
         key, dataBuffer);

    const encryptedBytes = new Uint8Array(encryptedData);

    dataStream.writeLong(keyHashWritten1);
    dataStream.writeLong(keyHashWritten2);
    dataStream.writeByte(getModeByte("AES_GCM_PBKDF2"));
    dataStream.writeBoolean(keyInputPair.compressed);

    const payloadStream = new JavaByteArrayOutputStream(new ArrayBuffer(salt.length + nonce.length + 4 + encryptedBytes.length));
    const payloadDataStream = new JavaDataOutputStream(payloadStream);
    payloadDataStream.writeBytes(salt);
    payloadDataStream.writeBytes(nonce);
    payloadDataStream.writeInt(encryptedBytes.length);
    payloadDataStream.writeBytes(encryptedBytes);

    const payloadBuffer = payloadStream.toArrayBuffer();
    dataStream.writeInt(payloadBuffer.byteLength);
    dataStream.writeBytes(new Uint8Array(payloadBuffer));
    payloadDataStream.close();
    payloadStream.close();
}

export async function encodeToBinary(keyInputPairs: Array<IKeyInputPair>): Promise<ArrayBuffer> {
    try {
        const outputStream: JavaByteArrayOutputStream = new JavaByteArrayOutputStream(arrayBuffer);
        const dataStream: JavaDataOutputStream = new JavaDataOutputStream(outputStream);

        dataStream.writeUTF(B64_HEADER);
        dataStream.writeShort(MAJOR_VERSION);
        dataStream.writeShort(MINOR_VERSION);
        dataStream.writeInt(keyInputPairs.length);

        for (let i = 0; i < keyInputPairs.length; i++) {
            const keyInputPair = keyInputPairs[i];
            console.log("Encoding pair " + String(i) + " with mode " + keyInputPair.mode);
            console.log("Key: " + keyInputPair.key);
            console.log("Input: " + keyInputPair.input);
            console.log("Mode: " + keyInputPair.mode);
            console.log("Compressed: " + keyInputPair.compressed);
            const keyBuffer = new TextEncoder().encode(keyInputPair.key);
            const keyHash = await crypto.subtle.digest("SHA-256", keyBuffer);
            switch (keyInputPair.mode) {
                case "XOR": 
                    await encodeBlockXor(keyInputPair, keyHash, dataStream).catch((e) => { throw e; });
                    break;
                case "AES_GCM": 
                    await encodeBlockAesGcm(keyInputPair, keyHash, dataStream).catch((e) => { throw e; }); 
                    break;
                case "AES_GCM_PBKDF2":
                    await encodeBlockAesGcmPBKDF2(keyInputPair, keyHash, dataStream).catch((e) => { throw e; });
                    break;
                default: throw TypeError("Invalid mode: " + keyInputPair.mode);
            }
        }
        const buffer: ArrayBuffer = outputStream.toArrayBuffer();
        dataStream.close();
        outputStream.close();
        return buffer;
    } catch (e) {
        console.error("Error during encoding:", e);
        throw e;
    }
}

export async function encode(keyInputPairs: Array<IKeyInputPair>): Promise<string> {
    const buffer: ArrayBuffer = await encodeToBinary(keyInputPairs).catch((e) => { throw e; });
    const b64: string = uint8ArrayToBase64(new Uint8Array(buffer));
    return HEADER + b64;
}

export function encodeBinaryToString(input: ArrayBuffer): string {
    const buffer: ArrayBuffer = input;
    const b64: string = uint8ArrayToBase64(new Uint8Array(buffer));
    return HEADER + b64;
}

async function decodeXor(payload: ArrayBuffer, keyBufferView: DataView, compressed: boolean) {
    const privateSeed1: bigint = keyBufferView.getBigInt64(16);
    const privateSeed2: bigint = keyBufferView.getBigInt64(24);
    const random: JavaRandom = new JavaRandom(privateSeed1 ^ privateSeed2);

    let data: Uint8Array = new Uint8Array(payload);
    const xorData: Uint8Array = new Uint8Array(data.length);
    random.nextUnsignedBytes(xorData);

    for (let i = 0; i < data.length; i++) {
        data[i] = data[i] ^ xorData[i];
    }

    if (compressed) {
        payload = await decompressGzip(payload);
    }

    return new TextDecoder().decode(payload);
}

async function decodeAesGcm(payload: ArrayBuffer, keyBufferView: DataView, compressed: boolean) {
    const payloadDataStream = new JavaDataInputStream(new JavaByteArrayInputStream(payload));

    const nonce: ArrayBuffer = payloadDataStream.readNBytes(12);
    const cipherLength = payloadDataStream.readInt();
    const ciphertext = payloadDataStream.readNBytes(cipherLength);

    const key = await crypto.subtle.importKey("raw", keyBufferView.buffer as ArrayBuffer, { name: "AES-GCM" }, false, ["decrypt"]);
    const keyHashWritten1: bigint = keyBufferView.getBigInt64(0);
    const keyHashWritten2: bigint = keyBufferView.getBigInt64(8);

    const aadView = new DataView(new ArrayBuffer(16));
    aadView.setBigInt64(0, keyHashWritten1);
    aadView.setBigInt64(8, keyHashWritten2);

    let plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce, additionalData: aadView.buffer, tagLength: 128 },
         key, ciphertext);

    if (compressed) {
        plaintext = await decompressGzip(plaintext);
    }

    return new TextDecoder().decode(plaintext);
}

async function decodeAesGcmPBKDF2(payload: ArrayBuffer, keyBufferView: DataView, key: string, compressed: boolean) {
    const payloadDataStream = new JavaDataInputStream(new JavaByteArrayInputStream(payload));

    const salt: ArrayBuffer = payloadDataStream.readNBytes(16);
    const nonce: ArrayBuffer = payloadDataStream.readNBytes(12);
    const cipherLength = payloadDataStream.readInt();
    const ciphertext = payloadDataStream.readNBytes(cipherLength);

    const baseKey = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(key),
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    const cryptoKey = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 600000,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
    );
    const keyHashWritten1: bigint = keyBufferView.getBigInt64(0);
    const keyHashWritten2: bigint = keyBufferView.getBigInt64(8);

    const aadView = new DataView(new ArrayBuffer(16));
    aadView.setBigInt64(0, keyHashWritten1);
    aadView.setBigInt64(8, keyHashWritten2);

    let plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: nonce, additionalData: aadView.buffer, tagLength: 128 },
         cryptoKey, ciphertext);

    if (compressed) {
        plaintext = await decompressGzip(plaintext);
    }

    return new TextDecoder().decode(plaintext);
}

export async function decodeFromBinary(input: ArrayBuffer, key: string): Promise<string> {
    const keyBuffer = new TextEncoder().encode(key);
    const keyHash = await crypto.subtle.digest("SHA-256", keyBuffer);
    const keyBufferView: DataView = new DataView(keyHash);
    const keyHash1: bigint = keyBufferView.getBigInt64(0);
    const keyHash2: bigint = keyBufferView.getBigInt64(8);

    const inputStream = new JavaByteArrayInputStream(input);
    const dataStream = new JavaDataInputStream(inputStream);

    const header: string = dataStream.readUTF();
    if (header !== B64_HEADER) {
        throw new TypeError("Invalid internal header format");
    }

    const majorVersion = dataStream.readShort();
    const minorVersion = dataStream.readShort();
    if (decodeVersionChecking) {
        if (majorVersion < MAJOR_VERSION) {
            throw new TypeError("Version mismatch: major version " + String(majorVersion) + " to running major version " + String(MAJOR_VERSION));
        }
    }
    const blocks = dataStream.readInt();

    console.log("Decoding...");
    console.log("Key: " + key);
    console.log("Input: " + input);
    console.log("Version: " + majorVersion + "." + minorVersion);
    console.log("BlockCount: " + blocks);

    for (let i = 0; i < blocks; i++) {
        const seed1: bigint = dataStream.readLong();
        const seed2: bigint = dataStream.readLong();
        const modeByte: number = dataStream.readByte();
        const mode: Mode | null = getModeFromByte(modeByte);
        const compressed: boolean = dataStream.readBoolean();
        const dataLength: number = dataStream.readInt();

        const match1 = seed1 === keyHash1;
        const match2 = seed2 === keyHash2;
        let matches = match1;
        matches &&= match2;
        if (!matches) {
            const skipped = dataStream.readBytes(new Uint8Array(dataLength).buffer as ArrayBuffer, 0, dataLength);
            if (skipped !== dataLength) {
                throw new Error("Failed to skip data stream");
            }

            continue;
        }

        const payloadBuffer: ArrayBuffer = new ArrayBuffer(dataLength);
        dataStream.readBytes(payloadBuffer, 0, dataLength);

        let output: string;
        switch (mode) {
            case "XOR": 
                output = await decodeXor(payloadBuffer, keyBufferView, compressed).catch((e) => { throw e; }); 
                break;
            case "AES_GCM": 
                output = await decodeAesGcm(payloadBuffer, keyBufferView, compressed).catch((e) => { throw e; });
                break;
            case "AES_GCM_PBKDF2": 
                output = await decodeAesGcmPBKDF2(payloadBuffer, keyBufferView, key, compressed).catch((e) => { throw e; });
                break;
            default: 
                throw new TypeError("Mode byte " + modeByte + " is not supported in this version of Textfuscator.");
        }
        return output;
    }

    dataStream.close();
    inputStream.close();

    throw new Error("No matching key found");
}

export async function decode(input: string, key: string): Promise<string> {
    if (!input.startsWith(HEADER)) {
        throw new Error("Invalid output format");
    }

    input = input.slice(HEADER.length);
    
    return decodeFromBinary(base64ToUint8Array(input).buffer as ArrayBuffer, key);
}