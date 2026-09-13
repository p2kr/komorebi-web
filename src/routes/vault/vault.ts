import { logger } from "$lib/core/telemetry";
import type { SubtitleFont, VaultMetadataDto, VideoChapter } from "$lib/models/vault";
import { isNil } from "es-toolkit";
import { TextTrack } from "vidstack";
import type { MediaPlayerElement } from "vidstack/elements";

export function setupPlayer(
	player: MediaPlayerElement | undefined,
	baseUrl: string,
	isOpen: boolean,
	dto: VaultMetadataDto | null
) {
	if (isNil(player) || !isOpen) {
		logger.debug("not found player", player, "isOpen", isOpen);
		return;
	}

	// TODO: Implement this
	// setupSubtitleRenderer(player, baseUrl, dto?.subtitle_fonts);

	player.addEventListener("can-play", () => setupChapters(player, dto?.video_chapters || []), {
		once: true
	});
}

// TODO:
export function setupSubtitleRenderer(
	player: MediaPlayerElement,
	baseUrl: string,
	fonts: SubtitleFont[] = []
) {
	const _fonts = fonts.reduce(
		(acc, v) => {
			acc[v.font_name] = baseUrl + v.file_path;
			return acc;
		},
		{} as Record<string, string>
	);

	logger.debug("fonts loaded: ", _fonts);

	// 3. Initialize the LibASS Renderer with the worker URLs
	// workerUrl: "/jassub/jassub-worker.js",
	// availableFonts: _fonts,
	// @ ts-expect-error expected type mismatch on import
	// const renderer = new LibASSTextRenderer(() => Promise.resolve({ default: JassubWithEvents }), {
	//   workerUrl: "/jassub/jassub-worker.js",

	//   availableFonts: _fonts,
	//   debug: true,
	// });

	// player.textRenderers.add(renderer);
}

function setupChapters(player: MediaPlayerElement, chapters: VideoChapter[]) {
	if (
		Array.from(player.textTracks || []).some((t) => t?.kind === "chapters") ||
		chapters.length == 0
	) {
		logger.debug("chapters already present/empty");
		return;
	}

	// Set chapters
	const chapterTrack = new TextTrack({
		kind: "chapters",
		type: "vtt",
		default: true
	});

	for (const chapter of chapters) {
		chapterTrack.addCue(new VTTCue(chapter.start_time, chapter.end_time, chapter.title));
	}

	logger.debug("chapters: ", chapterTrack);

	player.textTracks.add(chapterTrack);
	chapterTrack.setMode("showing");
}

// function setupAudioTracks(player: MediaPlayerElement, audio_tracks: AudioTrack[]) {
//   player.audioTracks.
// }
