<script lang="ts">
    import { downloadFile, uploadFile } from "$lib/common/downloadHelper";
    import { decode, setMaxMemoryBufferSize, DEFAULT_MAX_MEMORY_SIZE, decodeFromBinary, encodeBinaryToString, setDecodeVersionChecking } from "$lib/textfuscator/textfuscator";

    let key = $state("");
    let input = $state("");
    let output = $state("");
    let feedback = $state("");
    let runButtonDisabled = $state(false);
    let copyButtonDisabled = $state(false);
    let copyButtonText = $state("Copy");
    let maxMemorySize = $state(DEFAULT_MAX_MEMORY_SIZE);
    let skipVersionChecks = $state(false);

    function checkInputs(): boolean {
        if (key.trim() === "") {
            feedback = "Error: Key is empty";
            return false;
        }

        if (input.trim() === "") {
            feedback = "Error: Input is empty";
            return false;
        }

        feedback = "";
        return true;
    }

    async function requestDownloadToFile() {
        const output: string = await onRun();
        if (output !== null) {
            const blob: Blob = new Blob([ output ]);
            downloadFile(blob, "textfuscator" + Date.now() + ".txt");
        }
    }

    function printFeedback(e: Error) {
        console.error(e);
        if (e instanceof RangeError && e.message.includes("byte length is larger than maximum byte length")) {
            feedback = "Error: The operation exceeded the maximum memory buffer size of " + maxMemorySize + " bytes. Please increase the limit and try again.";
        } else if (e instanceof TypeError && e.message.includes("Version mismatch")) {
            feedback = "Error: " + e.message + "; Try disabling version checking and try again.";
        } else if (e.message.includes("Failed to skip data stream")) {
            feedback = "Error: Reached End of File while reading.";
        } else if (e.message.includes("No matching key found")) {
            feedback = "Error: No matching key found.";
        } else {
            feedback = "Error: \"" + String(e) + "\"; View the developer console for more details.";
        }
    }

    function onCopyText() {
        copyButtonDisabled = true;
        copyButtonText = "Copied!";
        navigator.clipboard.writeText(output);
        setTimeout(() => {
            copyButtonDisabled = false;
            copyButtonText = "Copy";
        }, 1000);
    }

    async function onUploadFile() {
        const buffer = await uploadFile(".tbf, .txt");
        if (buffer !== null) {
            input = encodeBinaryToString(buffer);
        }
    }

    async function onRun(): Promise<string> {
        runButtonDisabled = true;
        let successfulOutput: string = null as unknown as string;
        try {
            if (checkInputs()) {
                setMaxMemoryBufferSize(maxMemorySize); // is max memory size needed while decoding??
                setDecodeVersionChecking(!skipVersionChecks);
                const result = await decode(input, key);
                output = successfulOutput = result;
            }
        } catch (e) {
            console.error(e);
            printFeedback(e as Error);
        } finally {
            runButtonDisabled = false;
        }
        return successfulOutput;
    }
</script>

<h2 class="text-3xl self-center font-bold">Decoder</h2>

<div class="flex flex-col bg-gray-400 dark:bg-gray-700 p-4 gap-2">
    <input bind:value={key} class="bg-white dark:bg-gray-600 border border-black p-1" placeholder="Key" type="text">
    <textarea bind:value={input} class="bg-white dark:bg-gray-600 border border-black p-1" placeholder="Input"></textarea>
</div>

<div class="grid grid-cols-3 grid-flow-col auto-cols-auto gap-2">
    <!-- starting to understand that tailwind declarations are bigger than mt. fuji -->
    <button onclick={() => onUploadFile().catch((e) => printFeedback(e))} class="bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-800 col-start-1 col-end-3">Load from Binary</button>
    <button onclick={() => onRun().catch((e) => printFeedback(e))} disabled={runButtonDisabled} class="bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 col-start-3 col-end-4 py-2">Run</button>
</div>

<details>
    <summary>Advanced Options</summary>
    <div class="flex flex-col gap-1 ml-8">
        <div class="grid grid-cols-2 grid-flow-col auto-cols-auto gap-2">
            <p>Maximum Memory Size (Bytes):</p>
            <input type="number" class="bg-white dark:bg-gray-600 border border-black" bind:value={maxMemorySize} />
        </div>
        <div class="grid grid-cols-2 grid-flow-col auto-cols-auto gap-2">
            <p>Skip version checking?</p>
            <input type="checkbox" class="bg-white border col-start-2 col-end-4 object-right" bind:checked={skipVersionChecks} />
        </div>
    </div>
</details>

<p class="text-red-600 font-bold">{feedback}</p>

<p>Output:</p>
<textarea readonly class="bg-white dark:bg-gray-600 border border-black p-1">{output}</textarea>
<div class="grid grid-cols-2 grid-flow-col auto-cols-auto gap-2">
    <button onclick={() => onCopyText()} disabled={copyButtonDisabled} class="bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-800 py-1">{copyButtonText}</button>
    <button onclick={() => requestDownloadToFile().catch((e) => printFeedback(e))} disabled={runButtonDisabled} class="text-white bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 py-1">Run and Download to Binary</button>
</div>