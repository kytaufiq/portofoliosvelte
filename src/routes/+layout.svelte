<script>
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { theme } from "$lib/stores.js";
	import { browser } from "$app/environment";

	let { children } = $props();

	// Apply data-theme immediately from the store value on mount
	$effect(() => {
		if (browser) {
			document.documentElement.setAttribute("data-theme", $theme);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
