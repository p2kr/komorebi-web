<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Sidebar from "./Sidebar.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Komorebi</title>
</svelte:head>
<Sidebar>
	{@render children()}
</Sidebar>
