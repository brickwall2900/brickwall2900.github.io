<script lang="ts">
    import Content from '$lib/components/Content.svelte';
    import Link from '$lib/components/Link.svelte';
    import TextBox from '$lib/components/TextBox.svelte';
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<Content title="Gradle to libs.versions.toml">
    <p>
        This tool essentially just turns the <code>group:name:version</code> notation
        into an entry in the <code>libs.version.toml</code> file.
    </p>
    <p>
        If you don't know what that is, refer to the 
        <Link href="https://docs.gradle.org/current/userguide/version_catalogs.html">version catalogs</Link>
        section of the Gradle user manual.
    </p>

    <hr>

    <p>Dependency notations:</p>
    <TextBox placeholder="io.github.brickwall2900:something:1.0.0" />
    <p>Output:</p>
    <TextBox placeholder="..." />
</Content>