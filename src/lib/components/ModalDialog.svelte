<script lang="ts">
	import { fade, fly, slide } from "svelte/transition";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";
    import Window from "./Window.svelte";

    interface Props {
        ondialogclosing?: (() => boolean),
        title?: string,
        showing?: boolean,
        hasCloseButton?: boolean,
        children: Snippet
    }

    let { 
        ondialogclosing,
        title = $bindable("Dialog"),
        showing = $bindable(false),
        hasCloseButton = $bindable(true),
        children
    }: Props = $props();
    
    let dialogElement: HTMLDialogElement | undefined = $state();
    let windowComponent: Window | undefined = $state();

    function tryClosingTheDamnDialog(e: Event) {
        if (e.target === dialogElement) {
            windowComponent?.onCloseRequest();
        }
    }
</script>

{#if showing}
    <dialog 
        class="fixed w-full h-full mx-auto my-auto inset-0 bg-black/70 flex items-center justify-center z-150"
        onclick={tryClosingTheDamnDialog}
        in:fade={{duration: 250}}
        out:fade={{duration: 250}}
        bind:this={dialogElement}>
        <Window 
            onwindowclosing={ondialogclosing}
            bind:title={title}
            bind:showing={showing}
            bind:hasCloseButton={hasCloseButton}
            bind:this={windowComponent}
            canDrag={false}>
                {@render children?.()}
        </Window>
    </dialog>
{/if}