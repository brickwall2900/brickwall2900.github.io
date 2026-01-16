<script lang="ts">
    import LinkList from "$lib/components/LinkList.svelte";

    let { 
        name,
        children,
        links = []
    } = $props();
</script>

<article class="">
    <h2 class="text-4xl self-center font-bold mb-4">{name}</h2>
    {@render children?.()}
    <LinkList links={links} />
    <hr class="my-4">
</article>