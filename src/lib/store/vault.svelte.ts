import type { VaultItem, VaultSubItem } from "$lib/models/vault";
import { SvelteMap } from "svelte/reactivity";

class VaultStore {
	vaultItems = $state<VaultItem[]>([]);
	urlMap = new SvelteMap<string, VaultItem>();

	vaultSubItems = new SvelteMap<string, VaultSubItem[]>();

	isConnected = $state(false);

	setVaultItems(items: VaultItem[]) {
		this.vaultItems = items;
		this.urlMap.clear();
		for (const item of items) {
			this.urlMap.set(item.source_url, item);
		}
	}
}

export const vaultStore = new VaultStore();
