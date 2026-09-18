<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Content from '$lib/components/Content.svelte';
    import Window from '$lib/components/Window.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    let showing = $state(true);
    let name = $state("Testing");
    function onWindowCreateButtonPressed() {
        showing = true;
    }
    let timeout: any;

    $effect(() => {
        timeout = setInterval(() => {
            name = performance.now().toString();
        }, 1000);
        return () => clearTimeout(timeout);
    });
</script>

<Content title="adad">
    <p>hi</p>
    <Button onclick={onWindowCreateButtonPressed}>Show window</Button>

    {#if showing}
        <Window title={name} canDrag canMove onwindowclosing={() => { showing = false; return true;}}><p>hi</p></Window>
    {/if}
</Content>