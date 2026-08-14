import { doApiCall, type ApiResponse } from "$lib/core/api";
import { logger } from "$lib/core/telemetry";
import { formToPayload } from "$lib/core/utils";
import type { MediaProvider } from "$lib/models/media";
import type { User } from "$lib/models/user";
import { m } from "$lib/paraglide/messages";
import { getOauthClient } from "$lib/services/oauth";

export async function addUser(formData: FormData): Promise<ApiResponse<User>> {
	const isSandbox = formData.get("is_sandbox") == "true";
	const provider = formData.get("provider") as MediaProvider;
	const accessToken = formData.get("access_token");

	logger.debug("addUser: provider=", provider, "is_sandbox=", isSandbox);

	// exchange code and code_verifier for token
	if (!isSandbox && !accessToken) {
		const client = getOauthClient(provider);

		const { code, codeVerifier } = await client.getAuthCode();
		const accessToken = await client.exchangeCodeForToken(code, codeVerifier);

		if (accessToken) {
			formData.set("access_token", accessToken);
		} else {
			return {
				success: false,
				error: {
					code: "access_token_error",
					msg: m.failed_to_exchange_token()
				}
			};
		}

		formData.delete("code");
		formData.delete("code_verifier");
	}

	// Persist in db
	const payload = formToPayload(formData);
	const resp = await doApiCall<User>("user/add", {
		...payload,
		is_sandbox: isSandbox // backend not converting string to boolean.
	});

	logger.debug("added user : ", resp.success);

	return resp;
}

export async function deleteUser(
	formDataOrUserId: FormData | string
): Promise<ApiResponse<string>> {
	const payload =
		formDataOrUserId instanceof FormData
			? formDataOrUserId.get("user_id") || formDataOrUserId.get("userId")
			: formDataOrUserId;

	const resp = await doApiCall<string>("user/delete", {
		user_id: payload
	});

	logger.debug("deleting user ", payload, " :: ", resp.success);

	return resp;
}
