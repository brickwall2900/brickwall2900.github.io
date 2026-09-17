<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import ImageViewer from "./ImageViewer.svelte";

    interface Props {
        src: string,
        alt?: string,
        caption?: string,
        requiresImageViewer?: boolean,
        class?: string,
        style?: string,
        onclick?: (e: MouseEvent) => void,
        [key: string]: any
    }

    let { src, alt, requiresImageViewer = false, caption = undefined, class: className, style, onclick, ...others }: Props = $props();
    let isOpen = $state(false);

    function onImageClicked(e: MouseEvent) {
        isOpen = true;
        if (onclick) {
            onclick(e);
        }
    }

    function closeTheDamnPopup() {
        isOpen = false;
    }
</script>

{#if caption}
    <figure>
        <enhanced:img src={src} alt={alt} class={appendClassname(requiresImageViewer ? "cursor-pointer" : "", className)} style={style} {...others} onclick={onImageClicked} />
        <figcaption class={appendClassname("text-sm text-center mt-2", className)}>{caption}</figcaption>
    </figure>
{:else}
    <enhanced:img src={src} alt={alt} class={appendClassname(requiresImageViewer ? "cursor-pointer" : "", className)} style={style} {...others} onclick={onImageClicked} />
{/if}

{#if isOpen && requiresImageViewer}
    <ImageViewer src={src} alt={alt} closePopup={closeTheDamnPopup} {...others} />
{/if}