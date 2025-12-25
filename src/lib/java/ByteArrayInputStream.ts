import { JavaInputStream } from "./InputStream";

export class JavaByteArrayInputStream extends JavaInputStream {
    #buffer: Uint8Array;
    #position: number

    constructor(buffer: ArrayBuffer) {
        super();
        this.#buffer = new Uint8Array(buffer);
        this.#position = 0;
    }

    override read(): number {
        if (this.#position >= this.#buffer.length) {
            return -1;
        }
        return this.#buffer[this.#position++];
    }

    override readBytes(bytes: ArrayBuffer, offset: number, length: number): number {
        let bytesRead = 0;
        if (this.#position >= this.#buffer.length) {
            return -1;
        }
        const byteArray = new Uint8Array(bytes);
        for (let i = 0; i < length; i++) {
            if (this.#position >= this.#buffer.length) {
                break;
            }
            let byteIndex = offset + i;
            byteArray[byteIndex] = this.#buffer[this.#position++];
            bytesRead++;
        }
        return bytesRead;
    }

    override readNBytes(bytes: number): ArrayBuffer {
        const buf = this.#buffer.slice(this.#position, this.#position + bytes).buffer;
        this.#position += bytes;
        return buf;
    }

    close(): void {
    }
}