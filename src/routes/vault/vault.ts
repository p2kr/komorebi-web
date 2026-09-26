import { logger } from "$lib/core/telemetry";
import type { VaultItem, VideoChapter } from "$lib/models/models";
import { isNil } from "es-toolkit";
import { TextTrack } from "vidstack";
import type { MediaPlayerElement } from "vidstack/elements";

export function setupPlayer(
	player: MediaPlayerElement | undefined,
	_baseUrl: string,
	isOpen: boolean,
	dto: VaultItem | null
) {
	if (isNil(player) || !isOpen) {
		logger.debug("not found player", player, "isOpen", isOpen);
		return;
	}

	player.addEventListener(
		"can-play",
		() => {
			setupChapters(player, dto?.video_chapters || []);
			if (dto?.duration_sec != null) {
				player.duration = dto?.duration_sec;
			} else {
				player.streamType = "live";
			}
			// if (player.provider?.type == "video") {
			// 	player.provider.loadSource(dto?.file_path);
			// }
		},
		{
			once: true
		}
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
