<script lang="ts">
    import { fade, fly, slide } from "svelte/transition";
    import Button from "./Button.svelte";
    import type { Snippet } from "svelte";
    import { MathHelper } from "$lib/common/mathCommon";
    import { Rectangle, TypesHelper, type RectangleType } from "$lib/types.svelte";

    export interface Props {
        onwindowclosing?: (() => boolean),
        title?: string,
        showing?: boolean
        hasCloseButton?: boolean,
        canMove?: boolean,
        canDrag?: boolean,
        initialX?: number,
        initialY?: number,
        globalParent?: boolean,
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
        globalParent = $bindable(false),
        children
    }: Props = $props();

    let theWindowItself: HTMLElement | undefined = undefined;

    let viewportBounds = $state<RectangleType | undefined>(undefined);
    let windowBounds = $state<RectangleType | undefined>(undefined);

    let titlebarPressed = $state(false);
    let offsetX = $state(initialX), offsetY = $state(initialY);
    let touchOffsetX = $state(0), touchOffsetY = $state(0);
    let closeButton: Button | undefined = $state(undefined);

    export function onCloseRequest() {
        if ((!onwindowclosing) || (onwindowclosing && onwindowclosing())) {
            showing = false;
        }
    }

    function onMousePressed(e: MouseEvent) {
        if (!canDrag) {
            return;
        }

        if (e.target === closeButton?.getButton()) {
            return false;
        }

        e.preventDefault();
        titlebarPressed = true;
        touchOffsetX = e.offsetX;
        touchOffsetY = e.offsetY;
    }

    function onMouseReleased(e: Event) {
        titlebarPressed = false;
    }

    function onMouseMoved(e: MouseEvent) {
        if (!canDrag) {
            titlebarPressed = false;
            return;
        }

        if (titlebarPressed) {
            const castedWindowElement = (theWindowItself as HTMLElement | undefined);
            const theParent = castedWindowElement?.parentElement;
            if (castedWindowElement && theParent) {
                console.log(theParent);
                viewportBounds = !globalParent ? TypesHelper.domRectToRectangle(theParent.getBoundingClientRect()) : Rectangle.ofWidthHeight(0, 0, window.innerWidth, window.innerHeight);
                windowBounds = TypesHelper.domRectToRectangle(castedWindowElement.getBoundingClientRect());
                console.log(viewportBounds, windowBounds);

                offsetX += MathHelper.clamp(windowBounds.left + e.movementX, viewportBounds.left, viewportBounds.right - windowBounds.getWidth()) - windowBounds.left;
                offsetY += MathHelper.clamp(windowBounds.top + e.movementY, viewportBounds.top, viewportBounds.bottom - windowBounds.getHeight()) - windowBounds.top;
            }
            e.preventDefault();
        }
    }

    function onTouchDragged(e: TouchEvent) {
        const touch = e.touches.item(e.touches.length - 1);
        if (!touch) {
            return;
        }

        if (!canDrag) {
            titlebarPressed = false;
            return
        }

        if (titlebarPressed) {
            offsetX = touch.clientX - touchOffsetX;
            offsetY = touch.clientY - touchOffsetY;
        }
    }

    function onScroll(e: Event) {
        if (titlebarPressed) {
            e.preventDefault();
        }
    }

    function onResized(e: Event) {
        //windowBounds = (theWindowItself as HTMLElement | undefined)?.getBoundingClientRect();
    }
</script>

<svelte:window 
    onpointermove={onMouseMoved} 
    ontouchmove={onTouchDragged} 
    onscroll={onScroll} 
    onpointerup={onMouseReleased}
    onresize={onResized} />

<section 
    bind:this={theWindowItself}
    class={"w-fit fixed bg-window text-content-text border-4 border-button-border"}
    in:fly={{duration: 250, y: -100}}
    out:fly={{duration: 250, y: 100}}
    style="transform: translate3d({offsetX}px, {offsetY}px, 0); touch-action: {titlebarPressed ? "none" : "auto"}" >
    <div>
        <nav 
            class={"w-full bg-window-titlebar px-2 py-1 flex flex-row shrink-0 justify-between touch-none " + (canDrag ? "cursor-move" : "")}
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
        <article class="p-2 flex flex-row gap-2 touch-none">
            {@render children?.()}
        </article>
    </div>
</section>