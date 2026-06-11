<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import type { Snippet } from "svelte";

    interface Props {
        title?: string,
        description?: string,
        class?: string,
        children?: Snippet
    }

    let {
        title = undefined,
        description = undefined,
        class: className = undefined,
        children = undefined
    }: Props = $props();
</script>

<section class={appendClassname("flex flex-col bg-content border-content-border text-content-text m-4 p-4 gap-2 border-2 max-w-7xl mx-auto", className)}>
    {#if title !== undefined}
        <h2 class="text-4xl self-center font-bold w-full text-center mb-1">{title}</h2>
    {/if}
    {#if description !== undefined}
        <p class="self-center w-full text-center whitespace-pre-wrap">{description}</p>
    {/if}
    {@render children?.()}
</section>