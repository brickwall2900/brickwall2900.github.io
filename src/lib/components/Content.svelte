<script lang="ts">
    let {
        title = undefined,
        description = undefined,
        className = "",
        children
    } = $props();
</script>

<section class={"flex flex-col bg-gray-200 dark:bg-gray-800 m-4 p-4 gap-2 max-w-7xl mx-auto " + className}>
    {#if title !== undefined}
        <h2 class="text-4xl self-center font-bold w-full text-center mb-1">{title}</h2>
    {/if}
    {#if description !== undefined}
        <p class="self-center w-full text-center">{description}</p>
    {/if}
    {@render children?.()}
</section>