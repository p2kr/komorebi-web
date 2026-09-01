<script lang="ts">
	import { onMount } from "svelte";
	import VaultItemsTitle from "./VaultItemsTitle.svelte";
	import VaultQueueTile from "./VaultQueueTile.svelte";
	import { fetchEventSource } from "@microsoft/fetch-event-source";
	import { Constants } from "$lib/core/constants";
	import type { AppEvent } from "$lib/models/events";
	import { vaultStore } from "$lib/store/vault.svelte";

	onMount(() => {
		const ctrl = new AbortController();

		fetchEventSource(Constants.BASE_API + "/vault/all", {
			onopen: async (response) => {
				vaultStore.isConnected = response.status == 200;
			},
			onmessage: function (msg) {
				try {
					const data = JSON.parse(msg.data) as AppEvent;
					if (data.type == "VaultItems") {
						vaultStore.setVaultItems(data.data || []);
					}
				} catch {
					// continue
				}
			},
			onclose: () => {
				vaultStore.isConnected = false;
			}
		});

		return () => {
			ctrl.abort();
			vaultStore.isConnected = false;
		};
	});
</script>

<div>
	<VaultQueueTile />
	<VaultItemsTitle />
</div>
