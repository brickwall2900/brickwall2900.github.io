<script lang="ts">
	import { fade, fly, slide } from "svelte/transition";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";

    interface Props {
        ondialogclosed?: ((e: Event) => boolean),
        title?: string,
        showing?: boolean,
        children: Snippet
    }

    let { 
        ondialogclosed,
        title = "Dialog",
        showing = $bindable(false),
        children
    }: Props = $props();

    function tryClosingTheDamnDialog(e: Event) {
        if (e.target !== e.currentTarget) {
            return;
        }

        if (ondialogclosed) {
            if (!ondialogclosed(e)) {
                return;
            }
        }
        
        showing = false;
    }
</script>

{#if showing}
    <dialog 
        class="fixed w-full h-full mx-auto my-auto inset-0 bg-black/70 flex items-center justify-center z-50"
        onclick={tryClosingTheDamnDialog}
        in:fade={{duration: 250}}
        out:fade={{duration: 250}}>
        <section 
            class="rounded bg-white dark:bg-gray-950 text-black dark:text-white"
            in:fly={{duration: 250, y: -100}}
            out:fly={{duration: 250, y: 100}}>
            <nav class="w-full bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded-tl rounded-tr flex flex-row justify-between">
                <p class="font-bold text-lg">{title}</p>
                <Button 
                    class="rounded-full bg-red-500 hover:bg-red-700 active:bg-red-800 text-white px-2"
                    onclick={tryClosingTheDamnDialog}>
                    Close
                </Button>
            </nav>
            <article class="p-2 flex flex-row gap-2">
                {@render children?.()}
            </article>
        </section>
    </dialog>
{/if}