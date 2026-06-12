<script lang="ts">
    import { giveBadge } from "$lib/badges/badges";

    import CheckBox from "$lib/components/CheckBox.svelte";
    import Content from "$lib/components/Content.svelte";
    import type { Snippet } from "svelte";
    import type { Action } from "svelte/action";

    //export { header };

    interface Props {
        children?: Snippet,
        title: string,
        description: string,
        dateCreated: Date,
        hasSwearing?: boolean,

        canSwear?: boolean
    }

    let {
        children = undefined,
        title,
        description,
        dateCreated,
        hasSwearing = false,

        canSwear = $bindable(false)
    }: Props = $props();

    let actualDescription = $derived(description + "\n" + `Created on ${dateCreated.toDateString()}`);
    let optionsToModify: number = $derived(hasSwearing ? 1 : 0);

    $effect(() => {
        if (hasSwearing && canSwear) {
            giveBadge("swear_word");
        }
    });
</script>

<script module>
    export { header };
</script>

<Content title={title} description={actualDescription} class="gap-4">
    <hr />

    <header class="flex flex-row gap-2 justify-between">
        <aside class="border-2 border-button-border bg-button p-2">
            <p class="font-bold text-center md:text-left">Options</p>
            <div class="md:ml-8">
                {#if optionsToModify > 0}
                    {#if hasSwearing}
                        <CheckBox label="Swearing Enabled" bind:value={canSwear} 
                        title="Use of swear words ARE contained within this writeup. This toggles them on or off, showing them or hiding them within text." />
                    {/if}
                {:else}
                    <p>No options to modify...</p>
                {/if}
            </div>
        </aside>
        <!-- sorry but the outline thing doesnt look like possible to me -->
        <!-- bro my head hurts wtf -->
        <!-- <aside class="border-2 border-button-border bg-button p-2">
            <p class="font-bold">Outline</p>
        </aside> -->
    </header>

    <main class="flex flex-col gap-4">
        {@render children?.()}
    </main>
</Content>

<!-- snippets lol -->
{#snippet header(level: number, text: string)}
    {#if level == 1}
        <div class="flex flex-col gap-2">
            <h1 class="text-3xl font-bold">{text}</h1>
            <hr />
        </div>
    {:else if level == 2}
        <div class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold">{text}</h1>
            <hr />
        </div>
    {:else if level == 3}
        <h3 class="text-xl font-bold">{text}</h3>
    {:else}
        <h4 class="text-md font-bold">{text}</h4>
    {/if}
{/snippet}