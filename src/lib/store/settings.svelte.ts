import { StorageKeys } from "$lib/core/constants";
import { logger } from "$lib/core/telemetry";
import { cloneDeep, debounce, merge } from "es-toolkit";
import localforage from "localforage";
import type { PartialDeep } from "type-fest";

export interface SettingsData {
	global: {
		theme: "light" | "dark" | "system";
		font: string;
		censor: {
			enabled: boolean;
			type: "blur" | "cats";
			media: "images" | "videos" | "both";
		};
	};
	dashboard: {
		title_pref: "english" | "romanized" | "native";
		visible_chips: string[];
	};
}

const DEFAULT_SETTINGS: SettingsData = {
	global: {
		theme: "system",
		font: "Inter",
		censor: {
			enabled: false,
			type: "blur",
			media: "images"
		}
	},
	dashboard: {
		title_pref: "english",
		visible_chips: []
	}
};

class SettingsStore {
	data = $state<SettingsData>(cloneDeep(DEFAULT_SETTINGS));

	get global() {
		return this.data.global;
	}

	get dashboard() {
		return this.data.dashboard;
	}

	updateSettings(settings: PartialDeep<SettingsData>) {
		merge(this.data, settings);
		this.saveSettings();
	}

	async loadSettings() {
		try {
			const saved = await localforage.getItem<PartialDeep<SettingsData>>(StorageKeys.SETTINGS);
			if (saved) merge(this.data, saved);
		} catch (err) {
			logger.warn("Failed to load settings:", err);
		}
	}

	saveSettings = debounce(async () => {
		try {
			await localforage.setItem(StorageKeys.SETTINGS, $state.snapshot(this.data));
		} catch (err) {
			logger.warn("Failed to save settings:", err);
		}
	}, 300);
}

export const settingsStore = new SettingsStore();
