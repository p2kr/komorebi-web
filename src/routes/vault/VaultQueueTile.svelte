<script lang="ts">
	import { parsedTitleCache } from "$lib/core/cache";
	import { toastFailure } from "$lib/core/utils";
	import { type DownloadJob, DownloadStatus } from "$lib/models/models";
	import * as Accordion from "$lib/components/ui/accordion/";
	import { vaultStore } from "$lib/store/vault.svelte";
	import pms from "pretty-ms";
	import CustomEmpty from "$lib/components/custom/CustomEmpty.svelte";
	import { CheckLine, CircleSlash, Gauge, Pause, RotateCcw, StepForward, X } from "@lucide/svelte";
	import * as Item from "$lib/components/ui/item";
	import { Button } from "$lib/components/ui/button";
	import prettyBytes from "pretty-bytes";
	import { Virtualizer } from "virtua/svelte";
	import { doLatestApiCall } from "$lib/core/api";
	import { handleDownloadJobDelete } from "./vault_service";
	import { toast } from "svelte-sonner";
	import { debounce } from "es-toolkit";
	import { onMount } from "svelte";
	import { fetchEventSource } from "@microsoft/fetch-event-source";
	import { Constants } from "$lib/core/constants";

	onMount(() => {
		const ctrl = new AbortController();
		fetchEventSource(Constants.BASE_API + "/vault/active", {
			signal: ctrl.signal,
			onmessage: (ev) => {
				try {
					vaultStore.queueJobs = JSON.parse(ev.data);

					// Parse title
					// vaultStore.queueJobs.forEach((item) => {
					// 	getParsedTitle(item.name).then((v) => {
					// 		parsedTitleMap.set(item.name, v.title?.[0] || item.name);
					// 	});
					// });
				} catch {
					// Do nothing
				}
			}
		});
		return () => {
			ctrl.abort("unmounted queue tile");
		};
	});

	const handlePauseResume = debounce(
		async function (e: EventTarget | null, item: DownloadJob) {
			const btn = e as HTMLButtonElement;
			btn.disabled = true;
			const endpoint = ["DOWNLOADING", "PENDING"].includes(item.status)
				? "vault/pause"
				: "vault/resume";

			const resp = await doLatestApiCall<unknown, Partial<DownloadJob>>(endpoint, {
				id: item.id
			});

			if (!resp.success) {
				toastFailure(resp);
			} else {
				toast("Resume/Retry queued");
			}
			btn.disabled = false;
		},
		500,
		{ edges: ["leading", "trailing"] }
	);
</script>

<div class="queue-tile rounded border">
	<Accordion.Root type="single" value={vaultStore.queueJobs.length > 0 ? "queue" : ""}>
		<Accordion.Item value="queue">
			<Accordion.Trigger class="items-center p-1 text-lg">Queue</Accordion.Trigger>
			<Accordion.Content class="max-h-[35vh] min-h-21 overflow-y-auto p-1">
				{#if vaultStore.queueJobs && vaultStore.queueJobs.length > 0}
					<Virtualizer data={vaultStore.queueJobs} getKey={(q) => q.id}>
						{#snippet children(job)}
							{const progress = $derived(job.progress.toFixed(1) + "%")}
							<Item.Root
								variant="outline"
								class="progress-bar my-0.5 p-1"
								style="--queue-progress:{progress};"
							>
								<Item.Media
									class="flex min-w-15 flex-col self-center! text-base font-semibold whitespace-break-spaces "
								>
									{#if job.eta_sec && job.eta_sec > 0}
										{const eta = $derived(pms(job.eta_sec * 1000, { unitCount: 2 }))}
										<span class="self-center">{eta.replace(" ", "\n")}</span>
									{/if}
								</Item.Media>
								<Item.Content>
									<Item.Title class="line-clamp-1">
										{job.name}
									</Item.Title>
									<Item.Description>
										{#await parsedTitleCache.fetch(job.name)}
											<div class="line-clamp-1">{job.name}</div>
										{:then parsedTitle}
											<div class="line-clamp-1">{parsedTitle?.title || job.name}</div>
										{/await}
										<div class="flex items-center gap-1">
											<span>{progress}</span>
											&middot;
											{#if job.status == "DOWNLOADING" || job.status == "PROCESSING"}
												<Gauge class="inline size-3" />
												<span>{prettyBytes(job.download_speed)}/s</span>
											{:else}
												<CircleSlash class="inline size-3" />
												{job.status}
											{/if}
											&middot;
											{#if job.status == "PROCESSING"}
												{job.status}
											{:else}
												<span>{prettyBytes(job.total_size)}</span>
											{/if}
										</div>
									</Item.Description>
								</Item.Content>
								<Item.Actions>
									<Button
										variant="secondary"
										disabled={job.status == DownloadStatus.Queued ||
											job.status == "COMPLETED" ||
											job.status == "PROCESSING"}
										onclick={(e) => handlePauseResume(e.target, job)}
									>
										{#if job.status == "DOWNLOADING"}
											<Pause />
										{:else if job.status == DownloadStatus.Error}
											<RotateCcw />
										{:else}
											<StepForward />
										{/if}
									</Button>
									<Button variant="destructive" onclick={() => handleDownloadJobDelete(job)}>
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
