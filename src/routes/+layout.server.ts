import type { ApiResponse } from "$lib/core/api";
import { Constants } from "$lib/core/constants";
import type { User } from "$lib/models/user";
import type { LayoutServerLoad } from "./$types";

type HomePageState = {
	users: [];
};

export const load: LayoutServerLoad = async function ({ fetch }) {
	// fetch users
	const resp = await fetch(Constants.BASE_API + "/user/all", {
		method: "post"
	});
	if (resp.status == 200) {
		const data: ApiResponse<User[]> = await resp.json();
		if (data.success) {
			return {
				users: data.data
			} as HomePageState;
		}
	}
};
