import { doApiCall } from "$lib/core/api";
import type { User } from "$lib/models/user";
import { settingsStore } from "$lib/store/settings.svelte";
import { userStore } from "$lib/store/user.svelte";
import type { LayoutLoad } from "./$types";

// This is SPA.
export const ssr = false;

export const load: LayoutLoad = async function ({ depends }) {
	depends("user:all");

	// Load settings
	await settingsStore.loadSettings();

	return {
		users: await loadUsers()
	};
};

// fetch users
async function loadUsers() {
	const resp = await doApiCall<User[]>("user/all");
	if (resp.success) {
		await userStore.setUsers(resp.data);
		return resp.data;
	}
	return [];
}
