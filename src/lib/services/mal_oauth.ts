import { PUBLIC_MAL_CLIENT_ID } from "$env/static/public";
import { Constants } from "$lib/core/constants";
import { logger } from "$lib/core/telemetry";
import type { OauthClient } from "$lib/services/oauth";

const malAuthUrl = "https://myanimelist.net/v1/oauth2/authorize";
const malTokenUrl = "https://myanimelist.net/v1/oauth2/token";
const malClientId = PUBLIC_MAL_CLIENT_ID;

function generateCodeVerifier(): string {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	const base64 = btoa(String.fromCharCode(...array));
	return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export class MalOauthClient implements OauthClient {
	async getAuthCode(): Promise<{ code: string; codeVerifier: string }> {
		return new Promise((resolve, reject) => {
			const currentOrigin = globalThis.location.origin;
			const codeChallenge = generateCodeVerifier();

			// Format state as a JSON string expected by auth.html
			const statePayload = JSON.stringify({
				origin: currentOrigin,
				provider: "MAL"
			});

			const params = new URLSearchParams({
				response_type: "code",
				client_id: malClientId,
				code_challenge: codeChallenge,
				redirect_uri: Constants.HOSTED_AUTH_PAGE,
				state: statePayload
			});

			const authUrl = `${malAuthUrl}?${params.toString()}`;

			const width = 500;
			const height = 600;
			const left = window.screenX + (window.outerWidth - width) / 2;
			const top = window.screenY + (window.outerHeight - height) / 2;

			const popup = window.open(
				authUrl,
				"MalOAuth",
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
					reject(new Error("OAuth popup was closed by the user"));
				}
			}, 500);

			// 3. Listen for the success/error callback
			const messageListener = (event: MessageEvent) => {
				const expectedStaticOrigin = new URL(Constants.HOSTED_AUTH_PAGE).origin;
				if (event.origin !== expectedStaticOrigin) return;

				// OAUTH_CALLBACK comes from static/auth.html
				if (event.data && event.data.type === "OAUTH_CALLBACK" && event.data.provider === "MAL") {
					cleanup(); // Stop timers and remove listener once we have a response

					if (event.data.code) {
						logger.log("received access token from MAL");
						resolve({
							code: event.data.code,
							codeVerifier: codeChallenge
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

	async exchangeCodeForToken(code: string, codeVerifier: string): Promise<string> {
		const response = await fetch(malTokenUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Access-Control-Allow-Origin": malTokenUrl
			},
			body: new URLSearchParams({
				client_id: malClientId,
				code: code,
				code_verifier: codeVerifier,
				grant_type: "authorization_code",
				redirect_uri: Constants.HOSTED_AUTH_PAGE
			})
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Failed to exchange authorization code");
		}

		return data.access_token; // <--- Real Access Token
	}
}
