<script lang="ts">
    import CodeIcon from '~icons/mdi/code';
    import type { Snippet } from "svelte";
    import Button from './Button.svelte';
    import { downloadFile } from '$lib/common/downloadHelper';

    interface Props {
        children?: Snippet,
        filename?: string,
        language?: string,
        code: string
    }

    let {
        children = undefined,
        filename = "file.txt",
        language = "text",
        code
    }: Props = $props();


    function onDownloadButtonPressed(e: Event) {
        downloadFile(new Blob([code]), filename);
    }

    function onCopyButtonPressed(e: Event) {
        navigator.clipboard.writeText(code);
    }
</script>

{#snippet renderCode()}
    {@const lines = code.trim().split("\n")}
    {#each lines as line, linenum}
        <button class="inline text-right text-sm mr-2 select-none border-r-2 pr-2 border-button-border">{linenum}</button>
        <span>{line}</span>
    {/each}
{/snippet}

<figure class="w-full">
    <figcaption aria-label={filename} class="bg-codeblock-tab border border-codeblock-border h-8 flex flex-row gap-2 items-center justify-between text-sm">
        <div class="flex flex-row gap-2 items-center pl-2">
            <CodeIcon />
            <p class="text-ellipsis whitespace-nowrap overflow-hidden">{language}</p>
        </div>
        <p>{filename}</p>
        <div>
        <Button class="py-1 px-2 border border-b-0 border-t-0 border-r-0" onclick={onCopyButtonPressed}>Copy</Button>
            <Button class="py-1 px-2 border border-b-0 border-t-0 border-r-0" onclick={onDownloadButtonPressed}>Download</Button>
        </div>
        
    </figcaption>
    <pre class="bg-codeblock border border-codeblock-border bg-clip-border px-2 py-2 overflow-x-scroll"><code class="grid grid-cols-[auto_1fr]">{@render renderCode()}</code></pre>
</figure>