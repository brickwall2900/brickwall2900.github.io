<script lang="ts">
    import Icon from '@iconify/svelte';
    
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
    <nav class="flex flex-row gap-2 mt-2 items-center">
        <p class="inline mr-2">Links:</p>
        {#each links as link}
            <a 
                href={link} 
                class="bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 rounded-2xl sm:text-base text-xs px-2 py-1 flex flex-row gap-2 items-center">
                {#if isHostNameSame("GitHub", link)}
                    <Icon icon="mdi:github" class="inline size-6" />
                    <p class="inline">GitHub</p>    
                {:else}
                    <Icon icon="mdi:globe" class="inline size-6" />
                    <p class="inline">{link}</p>
                {/if}
            </a>
        {/each}  
    </nav>
{/if}