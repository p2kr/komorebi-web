import { myFetch, type ApiResponse } from "$lib/core/api";
import { Constants } from "$lib/core/constants";
import { formToPayloadAsync } from "$lib/core/utils";
import type { User } from "$lib/models/user";
import { fail } from "@sveltejs/kit";
import type { ValueOf } from "type-fest";
import type { Actions } from "./$types";

const addUser = (async ({ request, fetch }) => {
	const payload = await request.formData();
	console.log("adding user", payload);
	const resp = await fetch(Constants.BASE_API + "/user/add", {
		method: "post",
		body: payload
	});

	if (resp.status == 200) {
		const data: ApiResponse<User> = await resp.json();
		if (data.success) {
			return data.data;
		}
	}
}) satisfies ValueOf<Actions>;

const deleteUser = (async ({ request, fetch }) => {
	const payload = await formToPayloadAsync(request.formData());
	console.log("deleting user", payload);
	const resp = await myFetch<User>(fetch, "/user/delete", {
		body: payload
	});
	if (!resp.success) {
		return fail(400, resp);
	}
	return resp;
}) satisfies ValueOf<Actions>;

export const actions = {
	addUser,
	deleteUser
} satisfies Actions;
