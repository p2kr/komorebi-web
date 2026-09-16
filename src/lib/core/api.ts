import { PUBLIC_API_URL } from "$env/static/public";
import { Constants } from "$lib/core/constants";
import ky, { type Options } from "ky";

export type SuccessResponse<T> = {
	success: true;
	data: T;
};

export type FailureResponse = {
	success?: false;
	error?: string;
	description?: string;
	errors?: unknown;
};

export type ApiResponse<T> = SuccessResponse<T> | FailureResponse;

export async function doApiCall<T, U = unknown>(
	endpoint: string,
	json?: U,
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
			error: "error occurred in " + endpoint,
			description: e instanceof Error ? e.message : String(e)
		} satisfies FailureResponse;
	}
}

const abortControllers: Record<string, AbortController> = {};

/**
 * By default, the cache key is the `endpoint`. Pass `cacheKey` in `options` to override.
 */
export async function doLatestApiCall<T, U = unknown>(
	endpoint: string,
	json?: U,
	options?: Options & { cacheKey?: string }
): Promise<ApiResponse<T>> {
	const key = options?.cacheKey ?? endpoint;

	// Abort the prior request if one is still in flight
	if (abortControllers[key]) {
		abortControllers[key].abort("Canceled by a newer request");
	}

	const controller = new AbortController();
	abortControllers[key] = controller;

	// Compose the internal controller with any external signal passed in options
	const combinedSignal = options?.signal
		? AbortSignal.any([controller.signal, options.signal])
		: controller.signal;

	try {
		return await doApiCall<T, U>(endpoint, json, {
			...options,
			signal: combinedSignal
		});
	} finally {
		if (abortControllers[key] === controller) {
			delete abortControllers[key];
		}
	}
}
