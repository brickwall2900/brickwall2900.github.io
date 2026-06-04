<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import type { Snippet } from "svelte";

    interface Props {
        children?: Snippet,
        onclick?: ((e: Event) => void),
        class?: string,
        [key: string]: any
    }

    let { 
        children,
        onclick = undefined,
        disabled = false,
        class: className = undefined,
        ...others
    }: Props = $props();

    function onActualClick(e: Event) {
        if (onclick) {
            onclick(e);
        }
    }
</script>

<button onclick={onActualClick} 
        disabled={disabled}
        class={appendClassname("bg-gray-600 text-white hover:bg-gray-500 active:bg-gray-600 disabled:bg-gray-800", className)}
        {...others}>
        {@render children?.()}
</button>
