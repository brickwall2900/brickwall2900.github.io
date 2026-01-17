<script lang="ts">
    let { closeDialog, title = "Dialog", children } = $props();
</script>

<dialog 
    class="fixed w-full h-full mx-auto my-auto inset-0 bg-black/70 flex items-center justify-center z-50"
    onclick={closeDialog}>
    <section class="rounded bg-white dark:bg-gray-950 text-black dark:text-white">
        <nav class="w-full bg-gray-300 dark:bg-gray-600 px-2 py-1 rounded-tl rounded-tr flex flex-row justify-between">
            <p class="font-bold text-lg">{title}</p>
            <button 
                class="rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-2"
                onclick={closeDialog}>
                Close
            </button>
        </nav>
        {@render children?.()}
    </section>
</dialog>