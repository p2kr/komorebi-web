import { ListStatus, MediaType } from "$lib/models/dto";

export type FilterOption<T = string> = {
	value: T;
	label: string;
};

export type FilterType = "select" | "text" | "checkbox";

export type MediaClientParams = {
	media_type: MediaType;
	status?: string;
	sort?: string;
	limit?: number;
	offset?: number;
	[key: string]: string | number | boolean | undefined;
};

export interface FilterDefinition<T = string> {
	key: string;
	label: string;
	type: FilterType;
	defaultValue: T;
	class?: string;
	placeholder?: string;
	options?: FilterOption<T>[] | ((currentFilters: MediaClientParams) => FilterOption<T>[]);
	isVisible?: (currentFilters: MediaClientParams) => boolean;
}

const mediaTypeOptions: FilterOption<MediaType>[] = [
	{
		value: MediaType.Anime,
		label: "Anime"
	},
	{
		value: MediaType.Manga,
		label: "Manga"
	}
];

const animeListStatus: FilterOption<ListStatus | "">[] = [
	{
		value: "",
		label: "All"
	},
	{
		value: ListStatus.Current,
		label: "Watching"
	},
	{
		value: ListStatus.Planning,
		label: "Plan to Watch"
	},
	{
		value: ListStatus.Completed,
		label: "Completed"
	},
	{
		value: ListStatus.Dropped,
		label: "Dropped"
	},
	{
		value: ListStatus.Paused,
		label: "On Hold"
	},
	{
		value: ListStatus.Repeating,
		label: "Re-watching"
	}
];

const mangaListStatus: FilterOption<ListStatus | "">[] = [
	{
		value: "",
		label: "All"
	},
	{
		value: ListStatus.Current,
		label: "Reading"
	},
	{
		value: ListStatus.Planning,
		label: "Plan to Read"
	},
	{
		value: ListStatus.Completed,
		label: "Completed"
	},
	{
		value: ListStatus.Dropped,
		label: "Dropped"
	},
	{
		value: ListStatus.Paused,
		label: "On Hold"
	},
	{
		value: ListStatus.Repeating,
		label: "Re-reading"
	}
];

export const FILTER_CONFIGS: FilterDefinition[] = [
	{
		key: "media_type",
		label: "Media Type",
		type: "select",
		defaultValue: "Anime",
		options: mediaTypeOptions,
		class: "min-w-40"
	},
	{
		key: "status",
		label: "List Status",
		type: "select",
		defaultValue: "",
		class: "min-w-40",
		options: (filters) => (filters.media_type === "Anime" ? animeListStatus : mangaListStatus)
	}
];
