<script lang="ts">
    import CodeIcon from '~icons/mdi/code';
    import ContentCopyIcon from '~icons/mdi/content-copy';
    import DownloadOutlineIcon from '~icons/mdi/download-outline';

    import type { Snippet } from "svelte";
    import Button from './Button.svelte';
    import { downloadFile } from '$lib/common/downloadHelper';
    // i have one wish
    // i want syntax highlighting to work on SvelteKit client side
    // import Prism from 'prismjs';
    // import 'prism-svelte';

    interface Props {
        filename?: string,
        language?: string,
        copyEnabled?: boolean,
        code: string
    }

    let {
        filename = "file.txt",
        language = "text",
        copyEnabled = true,
        code
    }: Props = $props();


    function onDownloadButtonPressed(e: Event) {
        downloadFile(new Blob([code]), filename);
    }

    function onCopyButtonPressed(e: Event) {
        navigator.clipboard.writeText(code);
    }

    // $effect(() => {
    //     if (language) {
    //         // @ts-ignore
    //         import(`prismjs/components/prism-${language}`);
    //         //loadLanguages(language);
    //     }
    // });
</script>

<!-- <svelte:head>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/themes/prism.min.css" rel="stylesheet" />
</svelte:head> -->

{#snippet renderCode()}
    {@const lines = code.trim().split("\n")}
    {#each lines as line, linenum}
        <button class="inline text-right text-sm mr-2 select-none border-r-2 pr-2 border-button-border">{linenum}</button>
        <!-- {@const hasGrammar = language in Prism.languages}
        {#if hasGrammar}
            <span>{@html Prism.highlight(line, Prism.languages[language], language)}</span>
        {:else}
            <span>{line}</span>
        {/if} -->
        <span>{line}</span>
    {/each}
{/snippet}

{#snippet defineAction(callback: ((e: Event) => void), icon: Snippet, action: string)}
    <Button class="py-1 px-2 border border-b-0 border-t-0 border-r-0 flex flex-row items-center text-center justify-center flex-nowrap gap-2" onclick={callback}>
        {@render icon()}
        <span class="hidden sm:inline">{action}</span>
    </Button>
{/snippet}

{#snippet copyicon()}
    <ContentCopyIcon />
{/snippet}

{#snippet downloadicon()}
    <DownloadOutlineIcon />
{/snippet}

<figure class="w-full">
    <figcaption aria-label={filename} class="bg-codeblock-tab border border-codeblock-border h-8 flex flex-row gap-2 flex-nowrap items-center justify-between text-sm">
        <div class="flex flex-row gap-2 items-center pl-2">
            <CodeIcon />
            <span class="text-ellipsis whitespace-nowrap overflow-hidden">{language}</span>
            <span> * </span>
            <span class="overflow-hidden whitespace-nowrap text-nowrap text-ellipsis">{filename}</span>
        </div>
        {#if copyEnabled}
            <div class="flex flex-row flex-nowrap">
                {@render defineAction(onCopyButtonPressed, copyicon, "Copy")}
                {@render defineAction(onDownloadButtonPressed, downloadicon, "Download")}
            </div>
        {/if}
        
    </figcaption>
    <pre class="bg-codeblock border border-codeblock-border bg-clip-border px-2 py-2 overflow-x-scroll"><code class="grid grid-cols-[auto_1fr]">{@render renderCode()}</code></pre>
</figure>