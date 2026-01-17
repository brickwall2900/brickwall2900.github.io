<svelte:head>
    <title>Badges</title> 
</svelte:head>

<script lang="ts">
    import { getBadgeIds, getBadgeInfo, hasBadge, revokeBadge, type Badge } from "$lib/badges/badges";
    import { asset, resolve } from '$app/paths';
    import ModalDialog from "$lib/components/ModalDialog.svelte";
    import Spoiler from "$lib/components/Spoiler.svelte";
    import Content from "$lib/components/Content.svelte";

    const BADGE_ASSET_URL = "/assets/badges/";
    let showingBadgeDetails = $state(false);
    let showingBadgeId = $state("");
    let showingBadgeOwned = $state(false);
    let showingBadge = $state<Badge | undefined>(undefined);

    function showBadge(badgeId: string) {
        showingBadgeId = badgeId;
        showingBadge = getBadgeInfo(badgeId);
        showingBadgeOwned = hasBadge(badgeId);
        showingBadgeDetails = true;
    }

    function closeBadge(e: Event) {
        console.log(e.target + " " + e.currentTarget)
        if (e.target === e.currentTarget) {
            showingBadgeDetails = false;
        }
    }

    function confirmRevokeBadge(badgeId: string) {
        if (confirm("Are you sure? Revoking a badge removes it and you would have to complete it again.")) {
            showingBadgeDetails = false;
            revokeBadge(badgeId);
        }
    }
</script>

<main>
    <Content 
        title="Badges" 
        description="Badges are little special awards when you complete a task.
            There are currently {getBadgeIds().length} badge(s) and there will be more to come.
            Can you get them all?">
        <p class="self-center w-full text-center"><strong>NOTE: These are saved LOCALLY on your browser.</strong></p>

        <span>Badges completed:</span>
        <progress 
            class="w-full bg-gray-400" 
            value={(getBadgeIds().filter((id) => hasBadge(id)).length / getBadgeIds().length) * 100} 
            max="100"></progress>
        
        <section class="border border-gray-300 dark:border-gray-500 grid auto-rows-auto auto-cols-auto grid-flow-col justify-center gap-2 p-2">
            {#each getBadgeIds() as badgeId}
                <button 
                    class="cursor-pointer"
                    onclick={() => showBadge(badgeId)} 
                    title={badgeId}>
                    <enhanced:img 
                        class={"h-16 pointer-events-none " + (hasBadge(badgeId) ? "" : "grayscale blur-xs")} 
                        src={asset(BADGE_ASSET_URL + badgeId + ".png")} 
                        alt={getBadgeInfo(badgeId)?.name}/>
                </button>
            {/each}
        </section>
    </Content>
</main>

{#if showingBadgeDetails && showingBadge !== undefined}
    <ModalDialog closeDialog={closeBadge} title="Badge Viewer">
        <article class="p-2 flex flex-row gap-2">
            <aside>
                <enhanced:img 
                    class={"h-16 w-16 m-2 border pointer-events-none dark:border-white " + (hasBadge(showingBadgeId) ? "" : "grayscale blur-xs")} 
                    src={asset(BADGE_ASSET_URL + showingBadgeId + ".png")} 
                    alt={showingBadge.name}/>
            </aside>
            <main>
                <p>Name: <strong>{showingBadge.name}</strong></p>
                <p>{showingBadgeOwned ? showingBadge.description : "???"}</p>
                <br>
                <p>Hint: <Spoiler><em>{showingBadge.hint}</em></Spoiler></p>
                <p>Owned? <strong class={showingBadgeOwned ? "text-green-500" : "text-red-500"}>{showingBadgeOwned ? "YES" : "NO"}</strong></p>
                {#if showingBadgeOwned}
                    <br>
                    <button 
                        class="bg-red-600 hover:bg-red-700 active:bg-red-800 rounded w-full text-white font-bold" 
                        onclick={() => confirmRevokeBadge(showingBadgeId)}>
                        REVOKE BADGE
                    </button>
                {/if}
            </main>
        </article>
    </ModalDialog>
{/if}