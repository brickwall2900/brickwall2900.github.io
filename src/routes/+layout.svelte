<svelte:head>
	<link rel="icon" href={favicon} />
	<title>brickwall2900</title>
</svelte:head>

<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import GearIcon from '~icons/mdi/gear';
	import HamburgerMenuIcon from '~icons/mdi/hamburger-menu';
	import favicon from '$lib/assets/favicon.svg';
    import BadgeBanner from '$lib/badges/BadgeBanner.svelte';
    import { giveBadge } from '$lib/badges/badges';
    import { doResolve } from '$lib/common/doresolve';
    import SettingsDialog from './SettingsDialog.svelte';
    import { loadSettings } from '$lib/common/settings';
    import ModalDialog from '$lib/components/ModalDialog.svelte';

	let { children } = $props();
	let showingSettings = $state(false);
	let transferPortalShowing = $state(false);
	
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

{#snippet newNavItem(link: string, name: string, isTransferPortal?: boolean)}
	{#if !isTransferPortal}
		<li>
			<a href={doResolve(link)} class="block px-3 py-2 h-full select-none bg-navbar-button hover:bg-navbar-button-hover">{name}</a>
		</li>
	{:else}
		<a 
			href={doResolve(link)}
		 	class="block px-4 py-3 w-full h-full select-none border-button text-center border bg-navbar-button hover:bg-navbar-button-hover"
			onclick={() => transferPortalShowing = false}
			>{name}</a>
	{/if}
{/snippet}

{#snippet renderNavItems(transferPortal?: boolean)}
	{@render newNavItem("/", "Home", transferPortal)}
	{@render newNavItem("/projects", "Projects", transferPortal)}
	{@render newNavItem("/badges", "Badges", transferPortal)}
	{@render newNavItem("/writeups", "Writeups", transferPortal)}
{/snippet}

<nav class="fixed left-0 top-0 px-2 bg-navbar w-full">
	<div class="flex flex-wrap items-center justify-between mx-auto">
		<div class="items-center justify-between flex w-auto md:order-1">
			<ul class="hidden font-medium sm:flex p-0 flex-row space-x-2 rtl:space-x-reverse mt-0">
				<li><button
					onclick={showSettingsMenu}
					title="Settings" 
					class="bg-navbar-button px-3 py-2 hover:bg-navbar-button-hover size-full">
						<GearIcon />
					</button>
				</li>
				{@render renderNavItems(false)}
			</ul>
			<button onclick={() => transferPortalShowing = true} class="inline sm:hidden px-3 py-2 h-10 select-none bg-navbar-button hover:bg-navbar-button-hover">
				<HamburgerMenuIcon />
			</button>
		</div>
		<div class="md:order-2">
			
		</div>
	</div>
</nav>

<ModalDialog bind:showing={transferPortalShowing} hasCloseButton={false} title="Transfer Gadget">
	<main class="flex flex-col gap-2 p-2 size-full">
		<p class="text-center w-auto">Where to go?</p>
		<div class="grid grid-cols-2">
			{@render renderNavItems(true)}
		</div>
		<button
		onclick={showSettingsMenu}
		title="Settings" 
		class="bg-navbar-button px-3 py-2 hover:bg-navbar-button-hover size-full">
			Settings
		</button>
	</main>
</ModalDialog>

<BadgeBanner />
<SettingsDialog bind:showing={showingSettings} />

<div class="p-4"></div>

{@render children()}
