<script lang="ts">
    let { children } = $props();
    let spoilerShown = $state(false);

    function onSpoilerClicked(e: Event) {
        spoilerShown = true;
        e.stopPropagation();
    }
</script>

{#if !spoilerShown}
    <button 
        class="blur-[6px] hover:blur-xs text-left" 
        title="View spoiler"
        onclick={onSpoilerClicked}>
        {@render children?.()}
    </button>
{:else}
    {@render children?.()}
{/if}