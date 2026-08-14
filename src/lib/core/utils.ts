import type { FailureResponse } from "$lib/core/api";
import { m } from "$lib/paraglide/messages";
import { toast } from "svelte-sonner";

export function formToPayload(formData: FormData) {
	return Object.fromEntries(formData.entries());
}

export async function formToPayloadAsync(formData: Promise<FormData>) {
	return formToPayload(await formData);
}

export function toastFailure(resp: FailureResponse | string) {
	if (resp != null && typeof resp === "object" && resp.error) {
		toast(resp.error.code, {
			description: resp.error.msg
		});
	} else {
		toast(m.error(), {
			description: String(resp)
		});
	}
}
