import type { FailureResponse } from "$lib/core/api";
import { toast } from "svelte-sonner";

export function formToPayload(formData: FormData) {
	return JSON.stringify(Object.fromEntries(formData.entries()));
}

export async function formToPayloadAsync(formData: Promise<FormData>) {
	return formToPayload(await formData);
}

export function toastFailure(resp: FailureResponse | string) {
	if (typeof resp === "object" && resp.error) {
		toast(`${resp.error.code} -> ${resp.error.msg}`);
	} else {
		toast(String(resp));
	}
}
