<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import type { Snippet } from "svelte";

    interface Props { 
        href: string,
        class?: string,
        children?: Snippet
    }

    let { 
        href,
        class: className,
        children
    }: Props = $props();
</script>

<!-- amazing i have to use a component for consistent styles -->
<a 
class={appendClassname("underline text-blue-700 dark:text-blue-300 visited:text-purple-800 dark:visited:text-purple-300", className)} 
href={href}>
    {@render children?.()}
</a>