<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import { settings } from "$lib/common/settings";
    import type { Snippet } from "svelte";

    interface Props { 
        href: string,
        class?: string,
        newtab?: boolean
        children?: Snippet
    }

    let { 
        href,
        class: className,
        newtab = false,
        children
    }: Props = $props();

    const actuallyOpenInNewTab = $derived(newtab || settings.alwaysOpenLinksInNewTab);
</script>

<!-- amazing i have to use a component for consistent styles -->
<a 
class={appendClassname("underline text-blue-700 dark:text-blue-300 visited:text-purple-800 dark:visited:text-purple-300", className)} 
href={href}
target={actuallyOpenInNewTab ? "_blank" : "_self"}>
    {@render children?.()}
</a>