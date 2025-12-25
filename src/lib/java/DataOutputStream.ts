import { JavaOutputStream } from "./OutputStream";

export class JavaDataOutputStream extends JavaOutputStream {
    #outputStream: JavaOutputStream;
    #helperBuffer: ArrayBuffer = new ArrayBuffer(8);
    #helperView: DataView = new DataView(this.#helperBuffer);
    #helperUint8View: Uint8Array = new Uint8Array(this.#helperBuffer);

    constructor(outputStream: JavaOutputStream) {
        super();
        this.#outputStream = outputStream;
    }

    override write(byte: number): void {
        this.#outputStream.write(byte);
    }

    override writeBytes(bytes: Uint8Array): void {
        this.#outputStream.writeBytes(bytes);
    }

    override close(): void {
        this.#outputStream.close();
        this.#outputStream = null as unknown as JavaOutputStream;
        this.#helperBuffer = null as unknown as ArrayBuffer;
        this.#helperView = null as unknown as DataView;
        this.#helperUint8View = null as unknown as Uint8Array;
    }

    writeBoolean(value: boolean): void {
        this.write(value ? 1 : 0);
    }

    writeByte(value: number): void {
        this.write(value & 0xFF);
    }

    writeShort(value: number): void {
        this.#helperView.setInt16(0, value, false);
        this.writeBytes(this.#helperUint8View.subarray(0, 2));
    }

    writeInt(value: number): void {
        this.#helperView.setInt32(0, value, false);
        this.writeBytes(this.#helperUint8View.subarray(0, 4));
    }

    writeLong(value: bigint): void {
        this.#helperView.setBigInt64(0, value, false);
        this.writeBytes(this.#helperUint8View.subarray(0, 8));
    }

    writeUTF(value: string): void {
        const utf8encoder = new TextEncoder();
        const utf8bytes = utf8encoder.encode(value);
        this.writeShort(utf8bytes.length);
        this.writeBytes(utf8bytes);
    }
}