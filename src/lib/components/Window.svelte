<script lang="ts">
    import { fade, fly, slide } from "svelte/transition";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";

    export interface Props {
        onwindowclosing?: (() => boolean),
        title?: string,
        showing?: boolean
        hasCloseButton?: boolean,
        canMove?: boolean,
        canDrag?: boolean,
        initialX?: number
        initialY?: number,
        children: Snippet
    }

    let { 
        onwindowclosing,
        title = $bindable("Dialog"),
        showing = $bindable(false),
        hasCloseButton = $bindable(true),
        canMove = $bindable(false),
        canDrag = $bindable(true),
        initialX = $bindable(0),
        initialY = $bindable(0),
        children
    }: Props = $props();

    let titlebarPressed = $state(false);
    let offsetX = $state(initialX), offsetY = $state(initialY);
    let closeButton: Button | undefined = $state(undefined);

    export function onCloseRequest() {
        if ((!onwindowclosing) || (onwindowclosing && onwindowclosing())) {
            showing = false;
        }
    }

    function onMousePressed(e: Event) {
        if (!canDrag) {
            return;
        }

        if (e.target === closeButton?.getButton()) {
            return false;
        }

        e.preventDefault();
        titlebarPressed = true;
    }

    function onMouseReleased(e: Event) {
        titlebarPressed = false;
    }

    function onMouseMoved(e: MouseEvent) {
        if (titlebarPressed) {
            offsetX += e.movementX;
            offsetY += e.movementY;
        }

        if (!canDrag) {
            titlebarPressed = false;
            return;
        }
    }
</script>

<svelte:window onpointermove={onMouseMoved} onpointerup={onMouseReleased} />

<section 
    class={"w-fit absolute bg-window text-content-text border-4 border-button-border"}
    in:fly={{duration: 250, y: -100}}
    out:fly={{duration: 250, y: 100}}
    style="transform: translate3d({offsetX}px, {offsetY}px, 0);" >
    <div>
        <nav 
            class={"w-full bg-window-titlebar px-2 py-1 flex flex-row shrink-0 justify-between " + (canDrag ? "cursor-move" : "")}
            onpointerdown={onMousePressed}
            onpointerup={onMouseReleased}>
            <p class="font-bold text-lg">{title}</p>
            {#if hasCloseButton}
                <Button 
                    class="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white px-2 ml-2"
                    onclick={onCloseRequest}
                    bind:this={closeButton}>
                    Close
                </Button>
            {/if}
        </nav>
        <article class="p-2 flex flex-row gap-2">
            {@render children?.()}
        </article>
    </div>
</section>