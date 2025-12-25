export interface IArrayBufferViews {
    uint8View: Uint8Array;
    dataView: DataView;
}

export function makeViews(buffer: ArrayBuffer): IArrayBufferViews {
    return {
        uint8View: new Uint8Array(buffer),
        dataView: new DataView(buffer)
    };
}