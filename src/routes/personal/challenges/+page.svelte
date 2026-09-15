<script lang="ts">
    import Content from '$lib/components/Content.svelte';
    import type { PageProps } from '../$types';

    let { data }: PageProps = $props();
</script>

<Content title="hi!">
    <p>there should be an executable file downloading right now.</p>
    <p>don't worry! this isn't a virus!</p>
    <p>there's source code and everything, you can look at it here:</p>
    <hr>
    <p>thank you! i love you too!</p>
</Content>