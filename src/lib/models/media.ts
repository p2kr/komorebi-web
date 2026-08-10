export type MediaProvider = "MAL" | "ANILIST";

export type MediaType = "Anime" | "Manga";

export type MediaFormat =
  | "Unknown"
  | "Tv"
  | "TvShort"
  | "Movie"
  | "Special"
  | "Ova"
  | "Ona"
  | "Music"
  | "Manga"
  | "Novel"
  | "OneShot"
  | "Doujinshi"
  | "Manhwa"
  | "Manhua"
  | "Oel";

export type ReleaseStatus =
  "Unknown" | "Releasing" | "Finished" | "NotYetReleased" | "Cancelled" | "Hiatus";

export type ListStatus = "Current" | "Planning" | "Completed" | "Dropped" | "Paused" | "Repeating";

export type NsfwLevel = "Safe" | "Gray" | "Nsfw";

export interface MediaTitle {
  romanized?: string | null;
  english?: string | null;
  native?: string | null;
  user_preferred?: string | null;
}

export interface CoverImage {
  extra_large?: string | null;
  large?: string | null;
  medium?: string | null;
  color?: string | null;
}

export interface Media {
  id: string; // Uuid
  provider_id: string;
  provider: MediaProvider;
  media_type: MediaType;
  format: MediaFormat;
  release_status: ReleaseStatus;
  title: MediaTitle;
  cover: CoverImage;
  synopsis?: string | null;
  mean_score?: number | null; // 0.0 - 10.0
  popularity?: number | null;
  episodes?: number | null;
  duration?: number | null;
  chapters?: number | null;
  volumes?: number | null;
  genres: string[];
  nsfw: NsfwLevel;
}

export interface ListEntry {
  status: ListStatus;
  score?: number | null;
  progress?: number | null;
  progress_volumes?: number | null;
  is_repeating: boolean;
  repeat_count?: number | null;
  tags: string[];
  notes?: string | null;
  updated_at?: string | null;
}

export interface MediaEntry {
  media: Media;
  list_entry: ListEntry;

  // Client-side transient vault & download state helpers
  in_vault?: boolean;
  vault_unit_count?: number;
  downloading?: boolean;
  download_progress?: number;
}

export interface Paging {
  next_cursor?: string | null;
  prev_cursor?: string | null;
  has_next: boolean;
}

export interface PaginatedResponse {
  data: MediaEntry[];
  paging: Paging;
}
