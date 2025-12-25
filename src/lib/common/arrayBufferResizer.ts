// we have to discriminate against browsers now
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

export function resizeBuffer(buffer: ArrayBuffer, newByteLength: number): ArrayBuffer {
    if (buffer.resizable === false) {
        throw new TypeError("ArrayBuffer must be resizable");
    }
    if (isFirefox) {
        // TODO
    } else {
        buffer.resize(newByteLength);
    }
    return buffer;
}