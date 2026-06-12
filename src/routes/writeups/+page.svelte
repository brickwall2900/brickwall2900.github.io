<script lang="ts">
    import Content from '$lib/components/Content.svelte';
    import Link from '$lib/components/Link.svelte';
    import { getWriteupInfoList } from '$lib/writeups/writeups';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

{#snippet entry(id: string, title: string, description: string, date: Date)}
    <li class="border-2 border-button-border flex flex-col w-full p-4">
        <div class="flex flex-row justify-between">
            <Link class="text-xl hover:underline" href={`/writeups/${id}`}>{title}</Link>
            <p class="text-sm">{date.toDateString()}</p>
        </div>

        <div class="flex flex-row">
            <q class="text-md">{description}</q>
        </div>
    </li>
{/snippet}

<!-- so this is pretty dirty                                       -->
<!-- it's all hardcoded unfortunately...                           -->
<!-- i'm trying to do this quickly right now and finish it asap    -->
<!-- one day, i'll refactor this to a clean, data driven type shit -->
<!-- just one day...                                               -->
<!-- TODO                                                          -->

<Content title="Writeups">
    <p>Welcome to my writeups, where I just write about random stuff whenever I feel like it.</p>
    <hr />
    <article class="flex flex-col gap-2 my-4">
        <ul>
            {#each getWriteupInfoList() as writeup}
                {@render entry(writeup.id, writeup.name, writeup.description, writeup.modified ? writeup.modified : writeup.created)}
            {/each}
        </ul>
    </article>
    <hr />
    <p>None of my writeups are AI generated nor assisted. All created by brickwall2900.</p>
</Content>