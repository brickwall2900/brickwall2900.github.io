<script lang="ts">
    import Button from '$lib/components/Button.svelte';
    import Window from '$lib/components/Window.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    let showing = $state(true);
    function onWindowCreateButtonPressed() {
        showing = true;
    }
</script>

<p>hi</p>
<Button onclick={onWindowCreateButtonPressed}>Show window</Button>

{#if showing}
    <Window title="Testing" canDrag canMove onwindowclosing={() => { showing = false; return true;}}><p>hi</p></Window>
{/if}