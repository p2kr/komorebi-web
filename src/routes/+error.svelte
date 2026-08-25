<script lang="ts">
	import { goto } from "$app/navigation";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import SimpleTooltip from "$lib/components/custom/SimpleTooltip.svelte";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeft, House, RotateCw } from "@lucide/svelte";
</script>

<div class="wrapper">
	<h1 class="status">{page.status}</h1>

	{#if page.error?.message}
		<p class="msg">{page.error.message}</p>
	{/if}

	<div class="actions">
		<SimpleTooltip tip="Go Back" side="bottom">
			<Button variant="outline" size="icon" onclick={() => history.back()}>
				<ArrowLeft />
			</Button>
		</SimpleTooltip>
		<SimpleTooltip tip="Reload" side="bottom">
			<Button variant="outline" size="icon" onclick={() => window.location.reload()}>
				<RotateCw />
			</Button>
		</SimpleTooltip>
		<SimpleTooltip tip="Return to Dashboard" side="bottom">
			<Button variant="outline" size="icon" onclick={() => goto(resolve("/dashboard"))}>
				<House />
			</Button>
		</SimpleTooltip>
	</div>
</div>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Doto:wght@100..900&display=swap");

	.wrapper {
		font-family: "Doto", sans-serif;
		min-height: calc(100vh - 8rem);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 2rem 1rem;
		user-select: none;
	}

	.status {
		font-size: clamp(5rem, 15vw, 9.5rem);
		font-weight: 900;
		line-height: 1;
		letter-spacing: 0.06em;
		color: var(--foreground);
		margin: 0;
	}

	.msg {
		font-size: clamp(1.25rem, 3vw, 1.75rem);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--foreground);
		margin-top: 1rem;
		margin-bottom: 2rem;
		max-width: 36rem;
		line-height: 1.4;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
	}
</style>
