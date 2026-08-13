import { PUBLIC_ANILIST_CLIENT_ID } from "$env/static/public";
import { Constants } from "$lib/core/constants";
import { logger } from "$lib/core/telemetry";
import type { OauthClient } from "$lib/services/oauth";

const anilistOauthUrl = "https://anilist.co/api/v2/oauth/authorize";
const anilistClientId = PUBLIC_ANILIST_CLIENT_ID;

export class AnilistOauthClient implements OauthClient {
	getAuthCode(): Promise<{ code: string; codeVerifier: string }> {
		return new Promise((resolve, reject) => {
			const currentOrigin = globalThis.location.origin;

			const statePayload = JSON.stringify({
				origin: currentOrigin,
				provider: "ANILIST"
			});

			const params = new URLSearchParams({
				response_type: "token",
				client_id: anilistClientId,
				state: statePayload
			});

			const authUrl = `${anilistOauthUrl}?${params.toString()}`;

			const width = 500;
			const height = 600;
			const left = window.screenX + (window.outerWidth - width) / 2;
			const top = window.screenY + (window.outerHeight - height) / 2;

			const popup = window.open(
				authUrl,
				"AnilistOAuth",
				`width=${width},height=${height},left=${left},top=${top}`
			);

			// --- TIMEOUT & CLEANUP LOGIC --- //

			const timeoutMs = 30_000; // 30 seconds timeout

			// Centralized cleanup to prevent memory leaks
			const cleanup = () => {
				clearTimeout(timeoutId);
				clearInterval(checkClosedInterval);
				window.removeEventListener("message", messageListener);
			};

			// 1. Timeout if the user takes too long
			const timeoutId = setTimeout(() => {
				cleanup();
				if (popup && !popup.closed) {
					popup.close();
				}
				reject(new Error("OAuth request timed out"));
			}, timeoutMs);

			// 2. Reject if the user manually closes the popup
			const checkClosedInterval = setInterval(() => {
				if (popup?.closed) {
					cleanup();

					// Grace period: don't remove the messageListener yet —
					// give in-flight postMessage time to arrive
					setTimeout(() => {
						window.removeEventListener("message", messageListener);
						reject(new Error("OAuth popup was closed by the user"));
					}, 300);
				}
			}, 500);

			// 3. Listen for the success/error callback
			const messageListener = (event: MessageEvent) => {
				const expectedStaticOrigin = new URL(Constants.HOSTED_AUTH_PAGE).origin;
				if (event.origin !== expectedStaticOrigin) return;

				// OAUTH_CALLBACK comes from static/auth.html
				if (
					event.data &&
					event.data.type === "OAUTH_CALLBACK" &&
					event.data.provider === "ANILIST"
				) {
					cleanup(); // Stop timers and remove listener once we have a response

					if (event.data.code) {
						logger.log("received access token from ANILIST");
						resolve({
							code: event.data.code,
							codeVerifier: event.data.code
						});
					} else if (event.data.error) {
						logger.error("error getting access token", event.data.error);
						reject(new Error(event.data.error));
					}
				}
			};

			window.addEventListener("message", messageListener);
		});
	}

	exchangeCodeForToken(code: string, codeVerifier: string): Promise<string> {
		return Promise.resolve(code || codeVerifier);
	}
}
