<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import { onMount } from 'svelte';

	let { children } = $props();
	let isDarkModeEnabled = $state(localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));

	function toggleDarkMode() {
		isDarkModeEnabled = !isDarkModeEnabled;
		document.documentElement.classList.toggle('dark', isDarkModeEnabled);
		localStorage.theme = isDarkModeEnabled ? "dark" : "light";
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>brickwall2900</title>
</svelte:head>

<button onclick={() => toggleDarkMode()} class="bg-amber-400 hover:bg-amber-500 active:bg-amber-700 text-black dark:text-black fixed right-0 top-0">Toggle dark mode</button>

{@render children()}
