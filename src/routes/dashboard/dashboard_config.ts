import type { ListStatus, MediaType } from "$lib/models/media";

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
		value: "Anime",
		label: "Anime"
	},
	{
		value: "Manga",
		label: "Manga"
	}
];

const animeListStatus: FilterOption<ListStatus | "">[] = [
	{
		value: "",
		label: "All"
	},
	{
		value: "Current",
		label: "Watching"
	},
	{
		value: "Planning",
		label: "Plan to Watch"
	},
	{
		value: "Completed",
		label: "Completed"
	},
	{
		value: "Dropped",
		label: "Dropped"
	},
	{
		value: "Paused",
		label: "On Hold"
	},
	{
		value: "Repeating",
		label: "Re-watching"
	}
];

const mangaListStatus: FilterOption<ListStatus | "">[] = [
	{
		value: "",
		label: "All"
	},
	{
		value: "Current",
		label: "Reading"
	},
	{
		value: "Planning",
		label: "Plan to Read"
	},
	{
		value: "Completed",
		label: "Completed"
	},
	{
		value: "Dropped",
		label: "Dropped"
	},
	{
		value: "Paused",
		label: "On Hold"
	},
	{
		value: "Repeating",
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
