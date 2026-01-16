<script lang="ts">
    import ImageViewer from "./ImageViewer.svelte";

    let { src, alt, ...others } = $props();
    let isOpen = $state(false);

    function onImageClicked() {
        isOpen = true;
    }

    function closeTheDamnPopup() {
        isOpen = false;
    }
</script>

<enhanced:img src={src} alt={alt} {...others} onclick={onImageClicked} />

{#if isOpen}
    <ImageViewer src={src} alt={alt} closePopup={closeTheDamnPopup} {...others} />
{/if}