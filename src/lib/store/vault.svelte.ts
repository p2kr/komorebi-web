import type { DownloadJob, VaultItem } from "$lib/models/models";

class VaultStore {
	vaultItems = $state<VaultItem[]>([]);
	queueJobs = $state<DownloadJob[]>([]);

	urlMap = $derived.by(() => {
		return this.queueJobs.reduce((acc, job) => {
			acc.set(job.url, job);
			return acc;
		}, new Map<string, DownloadJob>());
	});
}

export const vaultStore = new VaultStore();
