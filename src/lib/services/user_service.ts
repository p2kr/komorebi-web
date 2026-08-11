import { doApiCall, type SuccessResponse } from "$lib/core/api";
import type { MediaProvider } from "$lib/models/media";
import type { User } from "$lib/models/user";
import { validate, version } from "uuid";

export const useFetchUsers = () =>
	createQuery(() => ({
		queryKey: ["fetch-users"],
		queryFn: async ({ signal }) => {
			const response = await doApiCall<User[]>("user/all", undefined, signal);
			if (response.success) {
				return (response as SuccessResponse<User[]>).data || [];
			}
			return [];
		}
	}));

export const useFetchUserById = (userId: string) =>
	createQuery(() => ({
		queryKey: ["fetch-user-by-id", userId],
		queryFn: async ({ signal }) => {
			if (!validate(userId) || version(userId) !== 7) {
				throw new Error("Invalid user id");
			}
			const response = (await doApiCall<User>(
				"user/one",
				{
					user_id: userId
				},
				signal
			)) as SuccessResponse<User>;
			if (response.success) {
				return response.data || null;
			}
			return null;
		}
	}));

export type SaveUserParam = {
	username: string;
	provider: MediaProvider;
	avatar_url?: string;
	access_token?: string;
};

export const useSaveUser = () =>
	createMutation(() => ({
		mutationFn: async ({ username, provider, avatar_url, access_token }: SaveUserParam) => {
			const response = (await doApiCall<User>("user/add", {
				username,
				provider,
				avatar_url,
				access_token
			})) as SuccessResponse<User>;

			if (response.success) {
				return response.data;
			}
			return null;
		}
	}));

export const useDeleteUser = () =>
	createMutation(() => ({
		mutationFn: async (userId: string) => {
			if (!validate(userId) || version(userId) !== 7) {
				throw new Error("Invalid user id");
			}
			const response = await doApiCall("user/delete", {
				user_id: userId
			});

			return response.success;
		}
	}));
