import type { MediaProvider } from "./media";

export interface User {
	id: string; // Uuid v7
	username: string;
	avatar_url: string | null;
	provider: MediaProvider;
	is_sandbox: boolean;
	access_token?: string | null;
	created_at: number; // timestamp millis
	updated_at: number; // timestamp millis
}

export interface CreateUserPayload {
	username: string;
	provider: MediaProvider;
	avatar_url?: string | null;
	access_token?: string | null;
}

export function isUserSandbox(user: User | null | undefined): boolean {
	if (!user) return true;
	return user.is_sandbox;
}
