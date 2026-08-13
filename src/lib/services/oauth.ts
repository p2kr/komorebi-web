import type { MediaProvider } from "$lib/models/media";
import { AnilistOauthClient } from "$lib/services/anilist_oauth";
import { MalOauthClient } from "$lib/services/mal_oauth";

export interface OauthClient {
	getAuthCode(): Promise<{
		code: string;
		codeVerifier: string;
	}>;
	exchangeCodeForToken(code: string, codeVerifier: string): Promise<string>;
}

export function getOauthClient(provider: MediaProvider): OauthClient {
	switch (provider) {
		case "MAL":
			return new MalOauthClient();
		case "ANILIST":
			return new AnilistOauthClient();
	}
}
