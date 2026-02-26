<script lang="ts">
    import Content from '$lib/components/Content.svelte';
    import { resolve } from "$app/paths";
    import type { PageProps } from './$types';
    import Link from '$lib/components/Link.svelte';

    let { data }: PageProps = $props();
</script>

{#snippet poemEntry(name: string, url: string)}
    <div class="my-2">
        <hr>
        <Link className="my-2 w-full text-center block" href={resolve(url)}>{name}</Link>
        <hr>
    </div>
{/snippet}

<Content title="Poetry">
    <p>Did you know? I'm not that much of a writer. However, I like to let my emotions out and feelings sometimes... so I try to write poetry!</p>

    <section>
        {@render poemEntry("🔒 her guiding light", "/personal/hyperpoetry")}
        {@render poemEntry("🌹 flower picking", "/personal/poems/flower-picking")}
    </section>
</Content>