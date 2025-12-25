import { makeViews, type IArrayBufferViews } from "$lib/common/arrayBufferViews";
import { JavaOutputStream } from "./OutputStream";

export class JavaByteArrayOutputStream extends JavaOutputStream {
    #buffer: ArrayBuffer;
    #views: IArrayBufferViews;
    #count: number;
    #size: number;

    constructor(arrayBuffer: ArrayBuffer) {
        super();

        this.#buffer = arrayBuffer;
        this.#views = makeViews(this.#buffer);
        this.#count = 0;
        this.#size = arrayBuffer.byteLength;
    }

    override write(byte: number): void {
        if (this.#buffer.resizable && this.#count + 1 >= this.#buffer.byteLength) {
            this.#size = this.#size * 1.5;
            console.log("Resizing ByteArrayOutputStream to " + String(this.#size));
            console.log("buffer before resize:", this.#buffer.byteLength);
            this.#buffer.resize(this.#size);
            console.log("buffer after resize:", this.#buffer.byteLength);
            this.#views = makeViews(this.#buffer);
        } else if (!this.#buffer.resizable && this.#count + 1 >= this.#buffer.byteLength) {
            throw new Error("ByteArrayOutputStream buffer overflow: cannot write more bytes");
        }

        this.#views.dataView.setUint8(this.#count++, byte);
    }

    override writeBytes(bytes: Uint8Array): void {
        if (this.#buffer.resizable && this.#count + bytes.length >= this.#buffer.byteLength) {
            this.#size = this.#size * 1.5 + bytes.length;
            console.log("Resizing ByteArrayOutputStream to " + String(this.#size));
            console.log("buffer before resize:", this.#buffer.byteLength);
            this.#buffer.resize(this.#size);
            console.log("buffer after resize:", this.#buffer.byteLength);
            this.#views = makeViews(this.#buffer);
        }  else if (!this.#buffer.resizable && this.#count + 1 >= this.#buffer.byteLength) {
            throw new Error("ByteArrayOutputStream buffer overflow: cannot write more bytes");
        }

        this.#views.uint8View.set(bytes, this.#count);
        this.#count += bytes.length;
    }

    override close(): void {
        this.#buffer = null as unknown as ArrayBuffer;
        this.#views = null as unknown as IArrayBufferViews;
        this.#count = 0;
        this.#size = 0;
    }

    // makes a new copy of the ArrayBuffer with only the used portion
    toArrayBuffer(): ArrayBuffer {  
        return this.#buffer.slice(0, this.#count);
    }

    getUnderlyingBuffer(): ArrayBuffer {
        return this.#buffer;
    }

    getSize(): number {
        return this.#count;
    }

    getViews(): IArrayBufferViews {
        return this.#views;
    }
}