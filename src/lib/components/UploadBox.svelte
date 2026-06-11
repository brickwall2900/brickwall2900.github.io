<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import TrayUploadIcon from '~icons/mdi/tray-upload';
    import FileIcon from '~icons/mdi/file';

    interface Props {
        value?: File[] | null,
        class?: string,
        fileUploadMode: FileUploadMode,
        onupload?: ((files: File[] | null) => void) | ((files: File | null) => void) | undefined,
        accept?: string | undefined,
        [key: string]: any
    }

    export type FileUploadMode = "FILE" | "FILE_MULTI" | "DIRECTORY";

    let {
        value = $bindable(),
        accept = undefined,
        class: className,
        fileUploadMode,
        onupload = undefined,
        ...others
    }: Props = $props();

    function callUploadFunction() {
        if (value === undefined) {
            return;
        }

        if (onupload) {
            if (fileUploadMode === "FILE") {
                (onupload as (((files: File | null) => void)))(value != null ? value[0] : null);
            } else {
                (onupload as (((files: File[] | null) => void)))(value);
            }
        }
    }

    function onChanged(e: Event) {
        if (e.currentTarget) {
            const fileList: FileList | null = (e.currentTarget as HTMLInputElement).files;
            if (fileList) {
                let files: Array<File> = [];
                for (let i = 0; i < fileList.length; i++) {
                    const file = fileList.item(i);
                    if (file) {
                        files.push(file);
                    }
                }
                value = files;
                callUploadFunction();
            }
        }
    }

    async function onDrop(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) {
            const files: File[] = await getFilesAsync(e.dataTransfer);
            value = files;
            callUploadFunction();
        }
    }
    
    function onDragOver(e: DragEvent) {
        if (!e.dataTransfer) {
            return;
        }
        e.preventDefault();
    }

    function canAcceptFile(file: File, acceptor: string): boolean {
        if (acceptor.startsWith(".")) {
            // extension check
            const filename = file.name;
            return filename.lastIndexOf(".") !== -1 && filename.substring(filename.lastIndexOf("."), filename.length) == acceptor;
        } else if (acceptor.endsWith("/*")) {
            // wildcard mime check
            const filetype = file.type;
            return filetype.substring(0, filetype.indexOf("/")) == acceptor.substring(0, acceptor.indexOf("/"));
        } else {
            return file.type == acceptor;
        }
    }

    function canAcceptFileDropped(file: File): boolean {
        if (accept) {
            const acceptorList = accept.split(",");
            let accepts = false;

            for (let i = 0; i < acceptorList.length; i++) {
                const acceptor = acceptorList[i].trim();
                accepts = accepts || canAcceptFile(file, acceptor);
            }

            return accepts;
        }

        // say yes by default lol
        return true;
    }

    // hippity hoppity
    // your code is now my property 
    // https://www.meziantou.net/upload-files-and-directories-using-an-input-drag-and-drop-or-copy-and-paste-with.htm

    async function getFilesAsync(dataTransfer: DataTransfer): Promise<File[]> {
        const files: File[] = [];
        for (let i = 0; i < dataTransfer.items.length; i++) {
            const item = dataTransfer.items[i];
            if (item.kind === "file") {
                if (typeof item.webkitGetAsEntry === "function") {
                    const entry = item.webkitGetAsEntry();
                    if (entry != null) {
                        const entryContent = await readEntryContentAsync(entry);
                        files.push(...entryContent);
                    }
                    continue;
                }

                const file = item.getAsFile();
                if (file && canAcceptFileDropped(file) && fileUploadMode !== "DIRECTORY") {
                    files.push(file);
                }
            }
        }

        return files;
    }

    // Returns a promise with all the files of the directory hierarchy
    function readEntryContentAsync(entry: FileSystemEntry): Promise<File[]> {
        return new Promise<File[]>((resolve, reject) => {
            let reading = 0;
            const contents: File[] = [];

            readEntry(entry);

            function readEntry(entry: FileSystemEntry) {
                if (isFile(entry)) {
                    reading++;
                    entry.file(file => {
                        if (!canAcceptFileDropped(file)) {
                            return;
                        }
                        reading--;
                        contents.push(file);

                        if (reading === 0) {
                            resolve(contents);
                        }
                    });
                } else if (isDirectory(entry)) {
                    readReaderContent(entry.createReader());
                }
            }

            function readReaderContent(reader: FileSystemDirectoryReader) {
                reading++;

                reader.readEntries(function (entries) {
                    reading--;
                    for (const entry of entries) {
                        readEntry(entry);
                    }

                    if (reading === 0) {
                        resolve(contents);
                    }
                });
            }
        });
    }

    // for TypeScript typing (type guard function)
    // https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
    function isDirectory(entry: FileSystemEntry): entry is FileSystemDirectoryEntry {
        return entry.isDirectory;
    }

    function isFile(entry: FileSystemEntry): entry is FileSystemFileEntry {
        return entry.isFile;
    }

    function formatFiles(): string {
        if (!value) {
            return "none";
        } else {
            const length = value.length;
            let output = "";
            for (let i = 0; i < length; i++) {
                if (i >= 3) {
                    output += `...and like ${length - 3} other things.`;
                    break;
                }

                const file = value[i];
                if (file) {
                    output += file.name + "; ";
                }
            }
            return output;
        }
    }
</script>

<label ondrop={onDrop} ondragover={onDragOver} class={appendClassname("flex flex-col py-8 items-center justify-evenly text-center w-full h-full gap-2 border-2 border-button-border bg-button cursor-pointer", className)}>
    {#if !value}
        <TrayUploadIcon class="w-16 h-16" />
        Drop {fileUploadMode === "DIRECTORY" ? "a directory" : (fileUploadMode === "FILE" ? "a file" : "some files")} here or click to upload.
        {#if accept}
            (Accepts {accept})
        {/if}
    {:else}
        <FileIcon class="w-16 h-16" />
        Selected: {formatFiles()}
    {/if}
    <input onchange={onChanged} class="hidden" accept={accept} type="file" multiple={fileUploadMode === "FILE_MULTI"} webkitdirectory={fileUploadMode === "DIRECTORY"} {...others}>
</label>
