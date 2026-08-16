<script lang="ts">
	import { settingsStore } from "$lib/store/settings.svelte";
	import type { HTMLImgAttributes } from "svelte/elements";
	import { cn } from "$lib/utils";
	import { hashString } from "$lib/core/utils";
	import { omitBy, isNil } from "es-toolkit";

	let {
		class: className,
		wrapperClass,
		src,
		height,
		width,
		...restProps
	}: HTMLImgAttributes & { wrapperClass?: string } = $props();

	let isLoaded = $state(false);

	const censor = $derived(settingsStore.global.censor);

	const isCensored = $derived(
		censor.enabled && (censor.media === "images" || censor.media === "both")
	);

	const finalSrc = $derived.by(() => {
		if (!isCensored) return src;

		if (censor.type === "cats") {
			const params = {
				height: height?.toString(),
				width: width?.toString(),
				id: hashString(src ?? "")
			};
			const query = new URLSearchParams(omitBy(params, isNil)).toString();
			return `https://cataas.com/cat/cute${query ? `?${query}` : ""}`;
		}

		return src;
	});

	const computedClass = $derived(cn(className, isCensored && censor.type === "blur" && "blur-3xl"));
</script>

<div class={cn("shrink-0 overflow-hidden", wrapperClass)}>
	{#key finalSrc}
		<img
			{...restProps}
			{height}
			{width}
			src={finalSrc}
			class={computedClass}
			data-loaded={isLoaded}
			loading="lazy"
			onload={() => (isLoaded = true)}
		/>
	{/key}
</div>

<style>
	img {
		opacity: 0;
		transition: opacity 1s ease;
	}

	img[data-loaded="true"] {
		opacity: 1;
	}
</style>
