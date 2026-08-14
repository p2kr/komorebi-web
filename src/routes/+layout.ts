import { doApiCall } from "$lib/core/api";
import type { LayoutLoad } from "./$types";

// This is SPA.
export const ssr = false;

type HomePageState = {
	users: [];
};

export const load: LayoutLoad = async function ({ depends }) {
	depends("user:all");

	return {
		users: await loadUsers()
	} as HomePageState;
};

// fetch users
async function loadUsers() {
	const resp = await doApiCall("user/all");
	if (resp.success) {
		return resp.data;
	}
	return [];
}
