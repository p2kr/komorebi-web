import { PUBLIC_API_URL } from "$env/static/public";
import { Constants } from "$lib/core/constants";
import ky, { type Options } from "ky";

export type SuccessResponse<T> = {
	success: true;
	data: T;
};

export type FailureResponse = {
	success: false;
	error: {
		code: string;
		msg: string;
	};
};

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;

export async function doApiCall<T>(
	endpoint: string,
	json?: unknown,
	options?: Options
): Promise<ApiResponse<T>> {
	try {
		endpoint = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
		const prefix = PUBLIC_API_URL + Constants.BASE_API; // TODO: Smart join (skip '/')
		const resp: ApiResponse<T> = await ky(endpoint, {
			method: "post",
			json,
			prefix,
			timeout: 10_000,
			totalTimeout: 30_000,
			...options
		}).json();

		return resp;
	} catch (e) {
		return {
			success: false,
			error: {
				code: e instanceof Error && e.cause ? String(e.cause) : "ERROR",
				msg: e instanceof Error ? e.message : String(e)
			}
		} satisfies FailureResponse;
	}
}

const apiCache: Record<string, AbortController> = {};

/**
 * By default, the cache key is the `endpoint`. Pass `cacheKey` in `options` to override.
 */
export async function doLatestApiCall<T>(
	endpoint: string,
	json?: unknown,
	options?: Options & { cacheKey?: string }
): Promise<ApiResponse<T>> {
	// Differentiate requests. Allow a custom key (e.g., endpoint + method)
	const key = options?.cacheKey ?? endpoint;

	// Abort the previous request if it exists
	if (apiCache[key]) {
		apiCache[key].abort("Canceled by a newer request");
	}

	const controller = new AbortController();
	apiCache[key] = controller;

	try {
		// Await the API call so we can hook into the 'finally' block
		return await doApiCall<T>(endpoint, json, {
			...options,
			signal: controller.signal
		});
	} finally {
		// Only clean up the cache if a NEWER request hasn't already overwritten it
		if (apiCache[key] === controller) {
			delete apiCache[key];
		}
	}
}
