<script lang="ts">
	import { getTitlePrefix, toastFailure } from "$lib/core/utils";
	import type { VaultActionPayload, VaultItem } from "$lib/models/vault";
	import * as Accordion from "$lib/components/ui/accordion/";
	import pms from "pretty-ms";
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";
	import { CheckLine, CircleSlash, Gauge, Pause, StepForward, X } from "@lucide/svelte";
	import * as Item from "$lib/components/ui/item";
	import { Button } from "$lib/components/ui/button";
	import prettyBytes from "pretty-bytes";
	import { Virtualizer } from "virtua/svelte";
	import { doApiCall } from "$lib/core/api";
	import { vaultStore } from "$lib/store/vault.svelte";
	import { handleDelete } from "./vault";

	let queueItems = $derived(vaultStore.vaultItems.filter((v) => v.status !== "COMPLETED"));

	async function handlePauseResume(e: EventTarget | null, item: VaultItem) {
		const btn = e as HTMLButtonElement;
		btn.setAttribute("disabled", "true");
		const endpoint =
			item.status == "DOWNLOADING" || item.status == "PENDING" ? "vault/pause" : "vault/resume";

		const resp = await doApiCall<unknown, VaultActionPayload>(endpoint, {
			vault_id: item.id
		});

		if (!resp.success) {
			toastFailure(resp);
		}
		btn.setAttribute("disabled", "false");
	}
</script>

<div class="queue-tile rounded border">
	<Accordion.Root type="single" value={queueItems.length > 0 ? "queue" : ""}>
		<Accordion.Item value="queue">
			<Accordion.Trigger class="items-center p-1 text-lg">Queue</Accordion.Trigger>
			<Accordion.Content class="max-h-[35vh] min-h-21 overflow-y-auto p-1">
				{#if queueItems && queueItems.length > 0}
					<Virtualizer data={queueItems} getKey={(q) => q.id}>
						{#snippet children(item)}
							{const progress = $derived(item.progress.toFixed(1) + "%")}
							<Item.Root
								variant="outline"
								class="progress-bar my-0.5 p-1"
								style="--queue-progress:{progress};"
							>
								<Item.Media
									class="flex min-w-15 flex-col self-center! text-base font-semibold whitespace-break-spaces "
								>
									{#if item.eta_seconds}
										{const eta = $derived(pms(item.eta_seconds * 1000, { unitCount: 2 }))}
										<span class="self-center">{eta.replace(" ", "\n")}</span>
									{/if}
								</Item.Media>
								<Item.Content>
									<Item.Title class="line-clamp-1"
										>{getTitlePrefix(item.season, item.episode, item.media_type).join(" : ")}
										{item.title}
									</Item.Title>
									<Item.Description>
										<div class="line-clamp-1">{item.raw_title}</div>
										<div class="flex items-center gap-1">
											{#if item.status == "DOWNLOADING"}
												<Gauge class="inline size-3" />
												<span>{prettyBytes(item.speed_bps)}/s</span>
											{:else}
												<CircleSlash class="inline size-3" />
												{item.status}
											{/if}
											&middot;
											<span>{progress}</span>
											&middot;
											<span>{prettyBytes(item.total_bytes)}</span>
										</div>
									</Item.Description>
								</Item.Content>
								<Item.Actions>
									<Button
										variant="secondary"
										disabled={item.status == "PENDING" || item.status == "COMPLETED"}
										onclick={(e) => handlePauseResume(e.target, item)}
									>
										{#if item.status == "DOWNLOADING" || item.status == "PENDING"}
											<Pause />
										{:else}
											<StepForward />
										{/if}
									</Button>
									<Button variant="destructive" onclick={() => handleDelete(item)}>
										<X />
									</Button>
								</Item.Actions>
							</Item.Root>
						{/snippet}
					</Virtualizer>
				{:else}
					<div class="h-fit rounded border border-dashed">
						<CustomEmpty
							Icon={CheckLine}
							title="No downloads in queue"
							desc="Add to queue from matcher screen"
							class="p-2"
						/>
					</div>
				{/if}
			</Accordion.Content>
		</Accordion.Item>
	</Accordion.Root>
</div>

<style>
	div.queue-tile :global(.progress-bar) {
		background: linear-gradient(
			to right,
			hsl(from var(--color-primary) h s l / 0.1) var(--queue-progress),
			transparent var(--queue-progress)
		);
		overflow: hidden;
	}
</style>
