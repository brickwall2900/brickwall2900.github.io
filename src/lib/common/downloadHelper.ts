export function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.classList.add("display: hidden");
    link.href = url;
    link.download = filename || "textfuscator.txt";

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function getPromiseFromEvent(item: HTMLElement, event: keyof HTMLElementEventMap): Promise<Event> {
  return new Promise((resolve) => {
    const listener = (e: Event) => {
      item.removeEventListener(event, listener);
      resolve(e);
    }
    item.addEventListener(event, listener);
  })
}

export async function uploadFile(allowedFiles: string): Promise<ArrayBuffer | null> {
    const input = document.createElement("input");
    input.style.display = "none";
    input.type = "file";
    input.multiple = false;
    input.accept = allowedFiles;

    document.body.appendChild(input);
    input.click();
    const onChange = getPromiseFromEvent(input, "change");
    await onChange;

    if (input.files !== null) {
        const file = input.files[0];
        console.log(file);
        if (file !== null) {
            console.log(file.name);
            document.body.removeChild(input);
            return await file.arrayBuffer();
        }
    }

    return null;
}