<svelte:head>
	<link rel="icon" href={favicon} />
	<title>brickwall2900</title>
</svelte:head>

<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import { browser } from '$app/environment';
	import { resolve } from "$app/paths";
    import BadgeBanner from '$lib/badges/BadgeBanner.svelte';
    import { giveBadge } from '$lib/badges/badges';
    import Icon from '@iconify/svelte';

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
			giveBadge("dark_mode_toggle");
		}
	}

	if (browser) {
		// ermmmm
		setTimeout(() => giveBadge("welcome"), 1000);
	}
</script>

<nav class="fixed left-0 top-0 p-2 bg-gray-300 dark:bg-gray-600 w-full">
	<div class="flex flex-wrap items-center justify-between mx-auto">
		<div class="items-center justify-between flex w-auto md:order-1" id="navbar-cta">
			<ul class="font-medium flex p-0 border-default rounded-base flex-row space-x-2 rtl:space-x-reverse mt-0">
				<li>
					<a href={resolve("/")} class="block px-3 rounded bg-transparent h-full hover:bg-gray-400 dark:hover:bg-gray-500" aria-current="page">Home</a>
				</li>
				<li>
					<a href={resolve("/projects")} class="block px-3 rounded border-0 h-full hover:bg-gray-400 dark:hover:bg-gray-500">Projects</a>
				</li>
				<li>
					<a href={resolve("/badges")} class="block px-3 rounded border-0 h-full hover:bg-gray-400 dark:hover:bg-gray-500">Badges</a>
				</li>
			</ul>
		</div>
		<div class="md:order-2">
			
		</div>
	</div>
</nav>

<button
onclick={() => toggleDarkMode()}
title="Toggle Dark Mode" 
class="bg-amber-400 hover:bg-amber-500 active:bg-amber-700 text-black dark:text-black fixed top-0 right-0 p-4 rounded-bl-2xl">
	{#if isDarkModeEnabled}
		<Icon icon="mdi:lightbulb" class="w-full h-full" />
	{:else}
		<Icon icon="mdi:lightbulb-outline" class="w-full h-full" />
	{/if}
</button>

<BadgeBanner />

<div class="p-4"></div>

{@render children()}
