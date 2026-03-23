<script lang="ts">
    import Content from '$lib/components/Content.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<Content title="the gardener">
    <p class="whitespace-pre-line text-center">
        the gardener watering their seeds,
        seeds planted other than me,
        mine starved of its own needs,
        slowly decaying it becomes.

        the flower struggles to survive,
        trying to find ways
        —ways to hold on longer,
        'till it eventually gets all black,
        the flower has no will to revive.

        in the gardener's perspective,
        i water every seed,
        making sure
        —every flower meets their needs.

        the flower, greedy of water,
        hungry and aching, it wants more,
        —it starts decaying, decaying, decaying.

        the flower.
        unnoticed it feels,
        all the petals fall.

        the flower,
        it remembers,
        the gardener's favorite flower,
        constantly watered,
        was—, and only was me.
    </p>
</Content>