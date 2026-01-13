<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import { browser } from '$app/environment';
    import { Lightbulb, LightbulbOff } from '@lucide/svelte';

	let { children } = $props();
	
	const browserLocalStorage = globalThis.localStorage;
	let localStorage: any[any] = [];
	let isDarkModeEnabled = $state(false);
	if (browser) {
		localStorage = browserLocalStorage;
		isDarkModeEnabled = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
	}
	
	function toggleDarkMode() {
		if (browser) {
			isDarkModeEnabled = !isDarkModeEnabled;
			document.documentElement.classList.toggle('dark', isDarkModeEnabled);
			localStorage.theme = isDarkModeEnabled ? "dark" : "light";
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>brickwall2900</title>
</svelte:head>

<button 
	onclick={() => toggleDarkMode()} 
	title="Toggle Dark Mode" 
	class="bg-amber-400 hover:bg-amber-500 active:bg-amber-700 text-black dark:text-black fixed right-0 top-0 p-2">
	{#if isDarkModeEnabled}
		<Lightbulb class="w-full h-full" />
	{:else}
		<LightbulbOff class="w-full h-full" />
	{/if}
</button>

{@render children()}
