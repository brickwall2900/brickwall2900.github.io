<svelte:head>
	<link rel="icon" href={favicon} />
	<title>brickwall2900</title>
</svelte:head>

<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import GearIcon from '~icons/mdi/gear';
	import favicon from '$lib/assets/favicon.svg';
    import BadgeBanner from '$lib/badges/BadgeBanner.svelte';
    import { giveBadge } from '$lib/badges/badges';
    import { doResolve } from '$lib/common/doresolve';
    import SettingsDialog from './SettingsDialog.svelte';
    import { loadSettings } from '$lib/common/settings';

	let { children } = $props();
	let showingSettings = $state(false);
	
	function showSettingsMenu() {
		showingSettings = true;
	}

	if (browser) {
		// ermmmm
		setTimeout(() => giveBadge("welcome"), 1000);
	}

	function onResize(e: UIEvent) {
		giveBadge("window_resize");
	}

	// load settings early step;
	// i do this so that SettingsDialog's effect() will save the loaded settings
	// without this, everything will go back to the default settings in settings.ts
	loadSettings();

	$effect(() => {
		loadSettings();
	});
</script>

<svelte:window onresize={onResize} />

{#snippet newNavItem(link: string, name: string)}
	<li>
		<a href={doResolve(link)} class="block px-3 rounded h-full select-none bg-navbar-button hover:bg-navbar-button-hover">{name}</a>
	</li>
{/snippet}

<nav class="fixed left-0 top-0 p-2 bg-navbar w-full">
	<div class="flex flex-wrap items-center justify-between mx-auto">
		<div class="items-center justify-between flex w-auto md:order-1" id="navbar-cta">
			<ul class="font-medium flex p-0 border-default rounded-base flex-row space-x-2 rtl:space-x-reverse mt-0">
				{@render newNavItem("/", "Home")}
				{@render newNavItem("/projects", "Projects")}
				{@render newNavItem("/badges", "Badges")}
				{@render newNavItem("/writeups", "Writeups")}
			</ul>
		</div>
		<div class="md:order-2">
			
		</div>
	</div>
</nav>

<button
onclick={() => showSettingsMenu()}
title="Settings" 
class="bg-amber-400 hover:bg-amber-500 active:bg-amber-700 text-black dark:text-black fixed top-0 right-0 p-4 rounded-bl-2xl">
	<GearIcon class="size-8 mx-auto my-auto" />
</button>

<BadgeBanner />
<SettingsDialog bind:showing={showingSettings} />

<div class="p-4"></div>

{@render children()}
