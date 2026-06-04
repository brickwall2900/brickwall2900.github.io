<script lang="ts">
    import Content from '$lib/components/Content.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<Content title="Writeups">
    <p>Welcome to my writeups, where I just write about random stuff whenever I feel like it.</p>
</Content>