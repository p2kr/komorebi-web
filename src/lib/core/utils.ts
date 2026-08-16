import type { FailureResponse } from "$lib/core/api";
import { m } from "$lib/paraglide/messages";
import DOMPurify from "dompurify";
import { LRUCache } from "lru-cache/raw";
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

// Quick string hash to turn any URL/ID into a stable, unique number
export function hashString(str: string): string {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
	}
	return (hash >>> 0).toString(36);
}

const synopsisCache = new LRUCache<string, string>({ max: 100 });

export function cleanSynopsis(key: string, synopsis: string | null | undefined): string {
	if (!synopsis) return "[NO SYNOPSIS]";

	const cached = synopsisCache.get(key);
	if (cached) return cached;

	const cleaned = sanitize(synopsis);
	synopsisCache.set(key, cleaned);
	return cleaned;
}

// TODO: Replace with faster regex.
function sanitize(text: string): string {
	return DOMPurify.sanitize(text);
}
