import { parsedTitleCache } from "$lib/core/cache";
import { logger } from "$lib/core/telemetry";
import type { VaultItem, VideoChapter } from "$lib/models/models";
import { isNil } from "es-toolkit";
import { TextTrack } from "vidstack";
import type { MediaPlayerElement } from "vidstack/elements";

export function setupPlayer(
	player: MediaPlayerElement | undefined,
	_baseUrl: string,
	isOpen: boolean,
	item: VaultItem
) {
	if (isNil(player) || !isOpen) {
		logger.debug("not found player", player, "isOpen", isOpen);
		return;
	}

	parsedTitleCache
		.fetch(item.file_name)
		.then((v) => (player.title = v?.title?.[0] || item.file_name));

	player.addEventListener(
		"can-play",
		() => {
			setupChapters(player, item?.video_chapters || []);
		},
		{
			once: true
		}
	);

	player.addEventListener(
		"auto-play-fail",
		(ev) => {
			logger.warn("autoplay failed. muting and retrying", ev);
			player.muted = true;
			player.play().catch((e) => logger.error("Autoplay failed:", e));
		},
		{ once: true }
	);
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
		if (chapter.start_time && chapter.end_time && chapter.title) {
			chapterTrack.addCue(new VTTCue(chapter.start_time, chapter.end_time, chapter.title));
		}
	}

	logger.debug("chapters: ", chapterTrack);

	player.textTracks.add(chapterTrack);
	chapterTrack.setMode("showing");
}

// function setupAudioTracks(player: MediaPlayerElement, audio_tracks: AudioTrack[]) {
//   player.audioTracks.
// }
