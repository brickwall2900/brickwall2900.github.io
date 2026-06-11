export function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = filename || "file.txt";

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

export async function uploadFile(allowedFiles: string): Promise<File | null> {
    const input = document.createElement("input");
    input.style.display = "none";
    input.type = "file";
    input.multiple = false;
    input.accept = allowedFiles;

    document.body.appendChild(input);
    const onChange = getPromiseFromEvent(input, "change");
    input.click();
    await onChange;

    if (input.files !== null) {
        const file = input.files[0];
        if (file !== null) {
            document.body.removeChild(input);
            return file;
        }
    }

    return null;
}

export async function uploadDirectory(): Promise<FileList | null> {
    const input = document.createElement("input");
    input.style.display = "none";
    input.type = "file";
    input.multiple = false;
    input.webkitdirectory = true;

    document.body.appendChild(input);
    const onChange = getPromiseFromEvent(input, "change");
    input.click();
    await onChange;

    if (input.files !== null) {
        return input.files;
    }

    return null;
}