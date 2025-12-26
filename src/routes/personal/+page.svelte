<svelte:head>
    <title>Personal Page</title> 
</svelte:head>

<script lang="ts">
    import { resolve } from "$app/paths";

    let links: [string] = [
        "/personal/hyperpoetry"
    ];
</script>

<p>Please choose an entry. Note that some of these are PASSWORD PROTECTED.</p>
<ul class="list-disc ml-8">
    <li>UNDER CONSTRUCTION</li>
    <!-- {#each links as link} -->
        <!-- <a href={resolve(link)} class="underline text-blue-700 dark:text-blue-300"><p>{link}</p></a> -->
    <!-- {/each} -->
</ul>