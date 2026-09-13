import { doApiCall } from "$lib/core/api";
import { toastFailure } from "$lib/core/utils";
import type { VaultActionPayload, VaultItem } from "$lib/models/vault";
import { toast } from "svelte-sonner";

export async function handleDelete(item: VaultItem) {
	const id = toast.warning("Are you sure you want to delete?", {
		description: item.raw_title,
		descriptionClass: "line-clamp-2",
		action: {
			label: "Yes",
			onClick: async () => {
				const resp = await doApiCall<unknown, VaultActionPayload>("vault/delete", {
					vault_id: item.id
				});

				if (!resp.success) {
					toastFailure(resp);
				} else {
					toast("Deletion queued");
				}
			}
		},
		cancel: {
			label: "No",
			onClick: () => {
				toast.dismiss(id);
			}
		}
	});
}

import { doLatestApiCall } from "$lib/core/api";
import type { VaultSubItemDto, VaultSubItemPayload } from "$lib/models/vault";

export async function get_vault_metadata(ids: string[]) {
	const resp = await doLatestApiCall<Record<string, VaultSubItemDto[]>, VaultSubItemPayload>(
		"vault/metadata",
		{
			vault_ids: ids
		}
	);
	if (resp.success) {
		return resp.data;
	} else {
		throw Error(resp.error);
	}
}

const languageName = new Intl.DisplayNames(["en"], { type: "language" });

export function betterSubtitleName(langCode: string, title: string) {
	if (langCode && langCode.length > 0) {
		const name = languageName.of(langCode);
		if (name) {
			return name + " [" + title + "]";
		}
		return title;
	}
	return title;
}
