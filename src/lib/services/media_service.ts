import type {
  ListStatus,
  MediaEntry,
  MediaProvider,
  MediaType,
  PaginatedResponse,
} from "$lib/models/media";
import { doApiCall, type SuccessResponse } from "$lib/core/api";
import { createInfiniteQuery } from "@tanstack/svelte-query";

export interface FetchUserMediaOptions {
  userId: string;
  provider?: MediaProvider;
  status?: ListStatus;
  sort?: string;
}

export interface FetchMediaResult {
  entries: MediaEntry[];
  errors: string[];
}

export const useUserMediaList = (mediaType: MediaType, options: FetchUserMediaOptions) =>
  createInfiniteQuery(() => ({
    queryKey: ["user-anime-list", mediaType, options],
    queryFn: ({ signal, pageParam }) => {
      let url = "media/anime";

      switch (mediaType) {
        case "Anime":
          url = "media/anime";
          break;
        case "Manga":
          url = "media/manga";
          break;
      }

      return doApiCall<PaginatedResponse>(
        url,
        {
          user_id: options.userId,
          provider: options.provider || "MAL",
          status: options.status,
          sort: options.sort,
          offset: pageParam,
        },
        signal
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (
        lastPage.success &&
        (lastPage as SuccessResponse<PaginatedResponse>).data?.paging?.next_cursor
      ) {
        return lastPageParam + 1;
      }
    },
  }));
