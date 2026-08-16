import { QueryClient } from "@tanstack/svelte-query";

export function init() {}

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 1 * 60 * 1000,
			gcTime: 5 * 60 * 1000
		}
	}
});
