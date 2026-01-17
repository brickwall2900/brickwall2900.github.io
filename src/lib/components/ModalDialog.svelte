<script lang="ts">
    let { closeDialog, children } = $props();
</script>

<dialog 
    class="fixed w-full h-full mx-auto my-auto inset-0 bg-black/70 flex items-center justify-center z-50"
    onclick={closeDialog}>
    <section class="rounded bg-white dark:bg-gray-950 text-black dark:text-white">
        {@render children?.()}
    </section>
</dialog>