import { doApiCall } from "$lib/core/api";
import { toastFailure } from "$lib/core/utils";
import type { VaultActionPayload, VaultItem } from "$lib/models/vault";
import { toast } from "svelte-sonner";

export async function handleDelete(item: VaultItem) {
	const resp = await doApiCall<unknown, VaultActionPayload>("vault/delete", {
		vault_id: item.id
	});

	if (!resp.success) {
		toastFailure(resp);
	} else {
		toast("Deletion queued");
	}
}
