<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import ImageViewer from "./ImageViewer.svelte";

    interface Props {
        src: string,
        alt?: string,
        caption?: string,
        requiresImageViewer?: boolean,
        class?: string
        [key: string]: any
    }

    let { src, alt, requiresImageViewer = false, caption = undefined, class: className, ...others }: Props = $props();
    let isOpen = $state(false);

    function onImageClicked() {
        isOpen = true;
    }

    function closeTheDamnPopup() {
        isOpen = false;
    }
</script>

{#if caption}
    <figure>
        <enhanced:img src={src} alt={alt} class={appendClassname(requiresImageViewer ? "cursor-pointer" : "", className)} {...others} onclick={onImageClicked} />
        <figcaption class="text-sm text-center mt-2">{caption}</figcaption>
    </figure>
{:else}
    <enhanced:img src={src} alt={alt} class={appendClassname(requiresImageViewer ? "cursor-pointer" : "", className)} {...others} onclick={onImageClicked} />
{/if}

{#if isOpen && requiresImageViewer}
    <ImageViewer src={src} alt={alt} closePopup={closeTheDamnPopup} {...others} />
{/if}