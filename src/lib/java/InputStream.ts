export class JavaInputStream {
    constructor() {
        if (new.target === JavaInputStream) {
            throw new TypeError("Cannot construct JavaInputStream instances directly");
        }
    }

    // Reads an unsigned byte from the input stream
    read(): number {
        throw new Error("Method not implemented.");
    }

    // Reads a byte array from the input stream writing from the offset to offset + length
    readBytes(bytes: ArrayBuffer, offset: number, length: number): number {
        let bytesRead = 0;
        const byteArray = new Uint8Array(bytes);
        for (let i = 0; i < length; i++) {
            let byteIndex = offset + i;
            const byte = this.read();
            if (byte === -1) {
                break; // End of stream
            }
            byteArray[byteIndex] = byte;
            bytesRead++;
        }
        return bytesRead;
    }

    // Reads a byte array from the input stream containing N bytes
    readNBytes(bytes: number): ArrayBuffer {
        const buffer = new Uint8Array(bytes);
        const bytesRead = this.readBytes(buffer.buffer, 0, bytes);
        return buffer.buffer.slice(0, bytesRead);
    }

    close(): void {
    }
}