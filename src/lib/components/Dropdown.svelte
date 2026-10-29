<script lang="ts">
    import { appendClassname } from "$lib/common/classname";
    import type { Snippet } from "svelte";

    interface Props {
        title: string,
        class: string,
        children: Snippet
    }

    let { title, class: className = "", children }: Props = $props();
</script>

<details class={className}>
    <summary class="font-semibold">{title}</summary>
    <div class="ml-8">
        {@render children?.()}
    </div>
</details>