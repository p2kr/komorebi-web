import type { MediaType } from "$lib/models/media";

export interface CrawlerResult {
	title: string;
	link: string;
	source: string;
	popularity?: string;
	size?: string;
	parsed_title: ParsedTitle;
	category: MediaType;
}

export interface ParsedTitle {
	audio_term: string[];
	device: string[];
	episode: string[];
	episode_title: string[];
	file_checksum: string[];
	file_extension: string[];
	language: string[];
	other: string[];
	part: string[];
	release_group: string[];
	release_information: string[];
	release_version: string[];
	season: string[];
	source: string[];
	subtitles: string[];
	title: string[];
	video_resolution: string[];
	video_term: string[];
	volume: string[];
	year: string[];
	episode_alt: string[];
	date: string[];
	type: string[];
}
