<script lang="ts">
	import type { Pathname } from "$app/types";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { getLocale, getTextDirection, locales, localizeHref } from "$lib/paraglide/runtime";
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import Sidebar from "./Sidebar.svelte";
	import { Constants } from "$lib/core/constants";
	import { Toaster } from "svelte-sonner";

	let { children } = $props();

	$effect(() => {
		document.documentElement.lang = getLocale();
		document.documentElement.dir = getTextDirection(getLocale());
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{Constants.APP_NAME}</title>
</svelte:head>

<Toaster position="top-center" />
<Sidebar>{@render children()}</Sidebar>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
