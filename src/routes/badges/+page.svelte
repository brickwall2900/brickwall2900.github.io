<svelte:head>
    <title>Badges</title> 
</svelte:head>

<script lang="ts">
    import { getBadgeIds, getBadgeInfo, hasBadge, type Badge } from "$lib/badges/badges";
    import { asset, resolve } from '$app/paths';
    import ModalDialog from "$lib/components/ModalDialog.svelte";

    const BADGE_ASSET_URL = "/assets/badges/";
    let showingBadgeDetails = $state(false);
    let showingBadgeId = $state("");
    let showingBadge = $state<Badge | undefined>(undefined);

    function showBadge(badgeId: string) {
        showingBadgeId = badgeId;
        showingBadge = getBadgeInfo(badgeId);
        showingBadgeDetails = true;
    }

    function closeBadge(e: Event) {
        console.log(e.target + " " + e.currentTarget)
        if (e.target === e.currentTarget) {
            showingBadgeDetails = false;
        }
    }
</script>
<section class="flex flex-col bg-gray-200 dark:bg-gray-800 m-4 p-4 gap-2 max-w-7xl mx-auto">
    <h2 class="text-4xl self-center font-bold w-full text-center mb-1">Badges</h2>
    <p class="self-center w-full text-center">
        Badges are little special awards when you complete a task.
        There are currently {getBadgeIds().length} badge(s) and there will be more to come.
        Can you get them all?
    </p>
    <p class="self-center w-full text-center"><strong>NOTE: These are saved LOCALLY on your browser.</strong></p>

    <span>Badges completed:</span>
    <progress 
        class="w-full bg-gray-400" 
        value={(getBadgeIds().filter((id) => hasBadge(id)).length / getBadgeIds().length) * 100} 
        max="100"></progress>
    
    <section class="border border-gray-300 dark:border-gray-500 grid auto-rows-auto auto-cols-auto grid-flow-col gap-2 p-2">
        {#each getBadgeIds() as badgeId, index}
            <button 
                class="cursor-pointer"
                onclick={() => showBadge(badgeId)} 
                title={badgeId}>
                <enhanced:img 
                    class={hasBadge(badgeId) ? "h-16" : "h-16 grayscale blur-xs"} 
                    src={asset(BADGE_ASSET_URL + badgeId + ".png")} 
                    alt={getBadgeInfo(badgeId)?.name}/>
            </button>
        {/each}
    </section>
</section>

{#if showingBadgeDetails && showingBadge !== undefined}
    <ModalDialog closeDialog={closeBadge} title="Badge Viewer">
        <article class="p-2 flex flex-row gap-2">
            <aside>
                <enhanced:img 
                    class={"h-16 w-16 border dark:border-white " + (hasBadge(showingBadgeId) ? "" : "grayscale blur-xs")} 
                    src={asset(BADGE_ASSET_URL + showingBadgeId + ".png")} 
                    alt={showingBadge.name}/>
            </aside>
            <main>
                <p>Name: <strong>{showingBadge.name}</strong></p>
                <p>Description: {showingBadge.description}</p>
                <p>Hint: <em>{showingBadge.hint}</em></p>
            </main>
        </article>
    </ModalDialog>
{/if}