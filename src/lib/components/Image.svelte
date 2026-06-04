<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import ImageViewer from "./ImageViewer.svelte";

    interface Props {
        src: string,
        alt?: string,
        requiresImageViewer?: boolean,
        class?: string
        [key: string]: any
    }

    let { src, alt, requiresImageViewer = false, class: className, ...others }: Props = $props();
    let isOpen = $state(false);

    function onImageClicked() {
        isOpen = true;
    }

    function closeTheDamnPopup() {
        isOpen = false;
    }
</script>

<enhanced:img src={src} alt={alt} class={appendClassname(requiresImageViewer ? "cursor-pointer" : "", className)} {...others} onclick={onImageClicked} />

{#if isOpen && requiresImageViewer}
    <ImageViewer src={src} alt={alt} closePopup={closeTheDamnPopup} {...others} />
{/if}