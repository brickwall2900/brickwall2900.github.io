import { BlobWriter, ZipWriter } from "@zip.js/zip.js";
import { uint8ArrayToBase64 } from "./base64Helper";

const WRITEUP_LIST_LOCATION = "";

export interface WriteupData {
    name: string,
    description: string,
    content: string // base64 zip compressed file
    coverImage: string | null // base64 png file
};

export async function generateWriteup(name: string, description: string, content: File[], coverImage: File | null): Promise<WriteupData> {
    // content compression
    const contentZipFileWriter = new BlobWriter();
    const contentZipWriter = new ZipWriter(contentZipFileWriter);
    for (let i = 0; i < content.length; i++) {
        const file = content[i];
        await contentZipWriter.add(file.name, file.stream());
    }
    await contentZipWriter.close();
    const contentBlob = await contentZipFileWriter.getData();
    const contentBytes = new Uint8Array(await contentBlob.arrayBuffer());

    const coverImageBytes = coverImage ? await coverImage.bytes() : null;

    const data: WriteupData = {
        name: name,
        description: description.length > 0 ? description : "< not provided >",
        content: uint8ArrayToBase64(contentBytes),
        coverImage: coverImageBytes ? uint8ArrayToBase64(coverImageBytes) : null
    };

    return data;
}