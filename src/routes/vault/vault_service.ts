import { doApiCall } from "$lib/core/api";
import { toastFailure } from "$lib/core/utils";
import type { DownloadJob, VaultItem } from "$lib/models/models";
import { toast } from "svelte-sonner";

export async function handleVaultItemDelete(item: VaultItem) {
	const id = toast.warning("Are you sure you want to delete?", {
		description: item.file_name,
		descriptionClass: "line-clamp-2",
		action: {
			label: "Yes",
			onClick: async () => {
				const resp = await doApiCall<unknown, Partial<VaultItem>>(
					"vault/delete_vault_item",
					{
						id: item.id
					},
					{
						method: "DELETE"
					}
				);

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

export async function handleDownloadJobDelete(item: DownloadJob) {
	const id = toast.warning("Are you sure you want to delete?", {
		description: item.name,
		descriptionClass: "line-clamp-2",
		action: {
			label: "Yes",
			onClick: async () => {
				const resp = await doApiCall<unknown, Partial<DownloadJob>>(
					"vault/delete",
					{
						id: item.id
					},
					{
						method: "DELETE"
					}
				);

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

const languageName = new Intl.DisplayNames(["en"], { type: "language" });

export function betterSubtitleName(langCode?: string, title?: string) {
	if (langCode && langCode.length > 0) {
		const name = languageName.of(langCode);
		if (name) {
			return name + " [" + title + "]";
		}
		return title;
	}
	return title;
}
