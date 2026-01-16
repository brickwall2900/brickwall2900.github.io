<script lang="ts">
    import { Viewer } from "svelte-image-viewer";

    let { src, alt, closePopup, ...others } = $props();

</script>

<dialog class="fixed w-full h-full mx-auto my-auto inset-0 bg-black/70 flex items-center justify-center z-50">
    <div class="relative w-full h-full flex items-center justify-center p-2">
        <p class="absolute w-full text-center text-white p-2">boo! 👻</p>
        <p class="absolute w-full top-1 text-center text-white mix-blend-exclusion p-2 z-20">Hello!! You're in an image viewer. Drag to pan the image around, pinch or mouse wheel to scroll.</p>
        <Viewer>
            <enhanced:img src={src} alt={alt} class="rounded shadow-lg max-w-full max-h-full z-10" />
        </Viewer>
        <button class="absolute top-2 right-2 m-2 text-white bg-black border border-white opacity-60 rounded-full px-4 py-3 hover:opacity-70 z-30" onclick={closePopup} >
            Close
        </button>
    </div>
</dialog>