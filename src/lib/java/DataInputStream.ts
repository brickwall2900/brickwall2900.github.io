import { JavaInputStream } from "./InputStream";

export class JavaDataInputStream extends JavaInputStream {
    #inputStream: JavaInputStream;
    #helperBuffer: ArrayBuffer = new ArrayBuffer(8);
    #helperView: DataView = new DataView(this.#helperBuffer);

    constructor(inputStream: JavaInputStream) {
        super();
        this.#inputStream = inputStream;
    }

    override read(): number {
        return this.#inputStream.read();
    }

    override readBytes(bytes: ArrayBuffer, offset: number, length: number): number {
        return this.#inputStream.readBytes(bytes, offset, length);
    }

    override readNBytes(bytes: number): ArrayBuffer {
        return this.#inputStream.readNBytes(bytes);
    }

    override close(): void {
        this.#inputStream.close();
        this.#inputStream = null as unknown as JavaInputStream;
        this.#helperBuffer = null as unknown as ArrayBuffer;
        this.#helperView = null as unknown as DataView;
    }

    readBoolean(): boolean {
        const byte = this.read();
        return byte !== 0;
    }

    readByte(): number {
        return this.read() & 0xFF;
    }

    readShort(): number {
        this.readBytes(this.#helperBuffer, 0, 2);
        return this.#helperView.getInt16(0, false);
    }

    readInt(): number {
        this.readBytes(this.#helperBuffer, 0, 4);
        return this.#helperView.getInt32(0, false);
    }

    readLong(): bigint {
        this.readBytes(this.#helperBuffer, 0, 8);
        return this.#helperView.getBigInt64(0, false);
    }

    readUTF(): string {
        const utf8Length = this.readShort();
        const utf8bytes = new Uint8Array(utf8Length);
        const bytesRead = this.readBytes(utf8bytes.buffer, 0, utf8Length);
        if (bytesRead != utf8Length) {
            throw new Error("Reached EOF while reading UTF");
        }
        const utf8decoder = new TextDecoder();
        return utf8decoder.decode(utf8bytes);
    }
}
