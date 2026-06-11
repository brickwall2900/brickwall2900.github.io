<script lang="ts">
    import { giveBadge } from "$lib/badges/badges";
    import Button from "./Button.svelte";

    let { children } = $props();
    let spoilerShown = $state(false);

    function onSpoilerClicked(e: Event) {
        spoilerShown = true;
        giveBadge("spoiler");
        e.preventDefault();
    }
</script>

{#if !spoilerShown}
    <Button 
        class="blur-[6px] hover:blur-xs text-left cursor-pointer" 
        title="View spoiler"
        onclick={onSpoilerClicked}>
        {@render children?.()}
    </Button>
{:else}
    {@render children?.()}
{/if}