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
        class={appendClassname("bg-button border-2 border-button-border hover:bg-button-hover active:bg-button-active disabled:bg-button-disabled", className)}
        {...others}>
        {@render children?.()}
</button>
