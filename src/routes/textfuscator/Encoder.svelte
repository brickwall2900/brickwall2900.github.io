<script lang="ts">
    import type { IKeyInputPair } from "$lib/textfuscator/textfuscator";
    import KeyInputPair from "./KeyInputPair.svelte";
    import { encode, setMaxMemoryBufferSize, DEFAULT_MAX_MEMORY_SIZE, encodeToBinary, encodeBinaryToString } from "$lib/textfuscator/textfuscator";
    import { downloadBlob } from "$lib/common/downloadHelper";

    let pairs = $state<{id: string, pair: IKeyInputPair}[]>([]);
    let feedback = $state("");
    let output = $state("");
    let runButtonDisabled = $state(false);
    let copyButtonDisabled = $state(false);
    let copyButtonText = $state("Copy");
    let maxMemorySize = $state<number>(DEFAULT_MAX_MEMORY_SIZE);

    function onAddPair(): string {
        let id: string = String(Date.now());
        pairs.push({ id: id, pair: { key: "", input: "", mode: "XOR", compressed: false } });
        return id;
    }

    function onRemovePair(id: string) {
        pairs = pairs.filter(pair => pair.id !== id);
    }

    function checkInputs(): boolean {
        if (pairs.length <= 0) {
            feedback = "Error: No key/input pair was added";
            return false;
        }

        feedback = "";
        return true;
    }

    async function requestDownloadToFile() {
        const output: ArrayBuffer = await onRun();
        if (output !== null) {
            const blob: Blob = new Blob([ output ]);
            downloadBlob(blob, "textfuscator" + Date.now() + ".tbf");
        }
    }

    function printFeedback(e: Error) {
        if (e instanceof RangeError && e.message.includes("byte length is larger than maximum byte length")) {
            feedback = "Error: The operation exceeded the maximum memory buffer size of " + maxMemorySize + " bytes. Please increase the limit and try again.";
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

    async function onRun(): Promise<ArrayBuffer> {
        runButtonDisabled = true;
        let successBuffer: ArrayBuffer = null as unknown as ArrayBuffer;
        try {
            if (checkInputs()) {
                let arrayPairs: Array<IKeyInputPair> = pairs.map(pair => pair.pair);
                console.log("Running with " + arrayPairs.map(pair => `${pair.key}:${pair.input} with ${pair.mode}`).join(", ") + " pairs");
                setMaxMemoryBufferSize(maxMemorySize);
                const result = await encodeToBinary(arrayPairs);
                successBuffer = result;
                output = encodeBinaryToString(result);
            }
        } catch (e) {
            printFeedback(e as Error);
        } finally {
            runButtonDisabled = false;
        }
        return successBuffer;
    }

    onAddPair(); // add empty pair
</script>

<h2 class="text-3xl self-center font-bold">Encoder</h2>
{#each pairs as pair (pair.id)}
    <KeyInputPair 
        bind:key={pair.pair.key} 
        bind:input={pair.pair.input} 
        bind:mode={pair.pair.mode}
        bind:compressed={pair.pair.compressed}
        onRemoveClicked={() => onRemovePair(pair.id)} />
{/each}
<div class="grid grid-cols-3 grid-flow-col auto-cols-auto gap-2">
    <button onclick={() => onAddPair()} class="bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-600">Add key/input pair</button>
    <button class="bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-800">Load from Binary</button>
    <button onclick={() => onRun().catch((e) => printFeedback(e))} disabled={runButtonDisabled} class="bg-green-600 text-white hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 col-start-3 col-end-4 py-2">Run</button>
</div>

<details>
    <summary>Advanced Options</summary>
    <div>
        <div class="grid grid-cols-2 grid-flow-col auto-cols-auto gap-2">
            <p>Maximum Memory Size (Bytes):</p>
            <input type="number" class="bg-white dark:bg-gray-600 border border-black" bind:value={maxMemorySize} />
        </div>
    </div>
</details>

<p class="text-red-600 font-bold">{feedback}</p>

<p>Output:</p>
<textarea readonly class="bg-white dark:bg-gray-600 border border-black p-1">{output}</textarea>
<div class="grid grid-cols-2 grid-flow-col auto-cols-auto gap-2">
    <button onclick={() => onCopyText()} disabled={copyButtonDisabled} class="bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-800 py-1">{copyButtonText}</button>
    <button onclick={() => requestDownloadToFile().catch((e) => printFeedback(e))} disabled={runButtonDisabled} class="text-white bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-300 py-1">Run and Download as Binary</button>
</div>