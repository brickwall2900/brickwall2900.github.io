export class JavaOutputStream {
    constructor() {
        if (new.target === JavaOutputStream) {
            throw new TypeError("Cannot construct JavaOutputStream instances directly");
        }
    }

    // Writes an unsigned byte to the output stream
    write(byte: number): void {
        throw new Error("Method not implemented.");
    }

    // Flushes the stream
    flush(): void {
    }

    close(): void {
    }

    // Writes an array of bytes to the output stream
    writeBytes(bytes: Uint8Array): void {
        for (let i = 0; i < bytes.length; i++) {
            this.write(bytes[i]);
        }   
    }
}