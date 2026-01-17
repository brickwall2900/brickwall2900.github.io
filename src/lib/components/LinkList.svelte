<script lang="ts">
    import { GithubIcon, GlobeIcon } from "@lucide/svelte";

    let { 
        links = []
    } = $props();
    
    const HOSTNAMES = new Map<string, string>();
    HOSTNAMES.set("GitHub", "github.com");

    function isHostNameSame(hostnameKey: string, urlString: string) {
        const url = new URL(urlString);
        return url.hostname === HOSTNAMES.get(hostnameKey);
    }
</script>

{#if links.length > 0}
    <div class="flex flex-row gap-2 mt-2 items-center">
        <p class="inline mr-2">Links:</p>
        {#each links as link}
            <a href={link} class="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-2xl px-2 py-1">
                {#if isHostNameSame("GitHub", link)}
                    <GithubIcon class="inline" />
                    <p class="inline">GitHub</p>    
                {:else}
                    <GlobeIcon class="inline" />
                    <p class="inline">{link}</p>
                {/if}
            </a>
        {/each}  
    </div>
{/if}