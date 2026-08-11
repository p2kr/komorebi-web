import { Constants } from "$lib/core/constants";

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

const TIMEOUT_SEC = 30;

// A native fetch wrapper (similar to Axios interceptors)
export async function myFetch<T>(
	svelteFetch: typeof fetch,
	endpoint: string,
	options: RequestInit = {}
): Promise<ApiResponse<T>> {
	// Act as a request interceptor (e.g., add base URL)
	let url = endpoint;
	if (!endpoint.startsWith("http")) {
		if (endpoint.startsWith("/")) {
			url = Constants.BASE_API + endpoint;
		} else {
			url = Constants.BASE_API + "/" + endpoint;
		}
	}

	const abortController = new AbortController();
	const timeoutId = setTimeout(() => {
		console.log("Request timed out");
		abortController.abort(new Error("Request timed out"));
	}, TIMEOUT_SEC * 1000);

	if (options.signal) {
		options.signal.addEventListener("abort", () => {
			console.log("Request aborted", options.signal?.reason);
			abortController.abort(options.signal?.reason);
		});
	}

	try {
		const response = await svelteFetch(url, {
			method: "POST",
			...options,
			headers: {
				"Content-Type": "application/json",
				...options.headers
			},
			signal: abortController.signal
		});

		// Act as a response interceptor
		if (!response.ok) {
			const respText = await response.text();
			throw new Error(`${url}\n${respText}\n`, {
				cause: `${response.status}:${response.statusText}]`
			});
		}

		return response.json(); // Automatically parse JSON like Axios
	} catch (e) {
		return {
			success: false,
			error: {
				code: e instanceof Error && e.cause ? String(e.cause) : "ERROR",
				msg: e instanceof Error ? e.message : String(e)
			}
		} satisfies FailureResponse;
	} finally {
		clearTimeout(timeoutId);
	}
}
