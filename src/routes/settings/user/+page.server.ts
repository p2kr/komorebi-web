import { myFetch, type FailureResponse } from "$lib/core/api";
import { logger } from "$lib/core/telemetry";
import * as utils from "$lib/core/utils";
import type { MediaProvider } from "$lib/models/media";
import type { User } from "$lib/models/user";
import { getOauthClient } from "$lib/services/oauth";
import { fail } from "@sveltejs/kit";
import type { ValueOf } from "type-fest";
import type { Actions } from "./$types";

const addUser = (async ({ request, fetch }) => {
	const formData = await request.formData();
	const isSandbox = formData.get("is_sandbox")?.toString() === "true";

	// exchange code and code_verifier for token
	if (!isSandbox) {
		const client = getOauthClient(formData.get("provider") as MediaProvider);
		const accessToken = await client.exchangeCodeForToken(
			formData.get("code") as string,
			formData.get("code_verifier") as string
		);
		if (accessToken) {
			formData.set("access_token", accessToken);
		} else {
			fail(400, {
				success: false,
				error: {
					code: "access_token_error",
					msg: "Failed to exchange code for token"
				}
			} as FailureResponse);
		}

		formData.delete("code");
		formData.delete("code_verifier");
	}

	const payload = utils.formToPayload(formData);
	const { access_token, ...safeFields } = JSON.parse(payload);
	const maskedToken = access_token
		? `${access_token.slice(0, 2)}${"*".repeat(Math.max(0, access_token.length - 4))}${access_token.slice(-2)}`
		: undefined;
	logger.log("adding user", { ...safeFields, access_token: maskedToken });

	const resp = await myFetch<User>(fetch, "/user/add", {
		body: payload
	});

	if (!resp.success) {
		return fail(400, resp);
	}
	return resp.data;
}) satisfies ValueOf<Actions>;

const deleteUser = (async ({ request, fetch }) => {
	const payload = await utils.formToPayloadAsync(request.formData());
	const { username: deletedUsername } = JSON.parse(payload);
	logger.log("deleting user", { username: deletedUsername });
	const resp = await myFetch(fetch, "/user/delete", {
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
