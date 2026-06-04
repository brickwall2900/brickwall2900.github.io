<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        title: string,
        children: Snippet
    }

    let { title, children }: Props = $props();
</script>

<details>
    <summary class="font-semibold">{title}</summary>
    <div class="ml-8">
        {@render children?.()}
    </div>
</details>