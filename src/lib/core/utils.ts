import type { FailureResponse } from "$lib/core/api";
import type { MediaTitle, MediaType } from "$lib/models/media";
import { m } from "$lib/paraglide/messages";
import type { SettingsData } from "$lib/store/settings.svelte";
import DOMPurify from "dompurify";
import { isNil, isString } from "es-toolkit";
import { LRUCache } from "lru-cache/raw";
import { toast } from "svelte-sonner";

export function formToPayload(formData: FormData) {
	return Object.fromEntries(formData.entries());
}

export async function formToPayloadAsync(formData: Promise<FormData>) {
	return formToPayload(await formData);
}

export function toastFailure(resp: FailureResponse | string | Error) {
	if (typeof resp === "string") {
		toast(m.error(), {
			description: String(resp)
		});
		return;
	}

	if (resp instanceof Error) {
		toast(m.error(), {
			description: resp.message + "->\n" + (resp.cause || "")
		});
		return;
	}

	toast(resp.error || m.error(), {
		description: resp.description
	});
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

export function getTitle(
	mediaTitle: MediaTitle,
	title_pref: SettingsData["dashboard"]["title_pref"]
): string {
	const unknownTitle = "[UNKNOWN]";
	switch (title_pref) {
		case "english":
			return (
				mediaTitle.english ||
				mediaTitle.romanized ||
				mediaTitle.native ||
				mediaTitle.user_preferred ||
				unknownTitle
			);
		case "romanized":
			return (
				mediaTitle.romanized ||
				mediaTitle.english ||
				mediaTitle.native ||
				mediaTitle.user_preferred ||
				unknownTitle
			);
		case "native":
			return (
				mediaTitle.native ||
				mediaTitle.english ||
				mediaTitle.romanized ||
				mediaTitle.user_preferred ||
				unknownTitle
			);
		default:
			return unknownTitle;
	}
}

export function getTitlePrefix(
	season: string | string[] | null = "?",
	episode: string | string[] | null = "?",
	mediaType: MediaType | null = "Anime"
) {
	season = season || "?";
	episode = episode || "?";
	mediaType = mediaType || "Anime";

	let prefix1 = "";
	let prefix2 = "";
	switch (mediaType) {
		case "Anime":
			prefix1 = "S";
			prefix2 = "E";
			break;
		case "Manga":
		case "Novel":
			prefix1 = "V";
			prefix2 = "C";
			break;
	}

	const s = isString(season) ? season : season[0];
	const e = isString(episode) ? episode : episode[0];

	return [prefix1 + (isNil(s) ? "?" : s), prefix2 + (isNil(e) ? "?" : e)];
}
