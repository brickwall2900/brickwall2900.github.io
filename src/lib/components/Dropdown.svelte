<script lang="ts">
    let { title, children } = $props();
</script>

<details>
    <summary class="font-semibold">{title}</summary>
    <div class="ml-8">
        {@render children?.()}
    </div>
</details>