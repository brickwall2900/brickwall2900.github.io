<script lang="ts">
    let { href, children }: { href: string, children?: any } = $props();
</script>

<!-- amazing i have to use a component for consistent styles -->
<a class="underline text-blue-700 dark:text-blue-300 visited:text-purple-800 dark:visited:text-purple-300" href={href}>{@render children?.()}</a>