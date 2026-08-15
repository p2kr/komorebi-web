import { StorageKeys } from "$lib/core/constants";
import { logger } from "$lib/core/telemetry";
import localforage from "localforage";
import type { ConditionalExcept, PartialDeep } from "type-fest";

type GlobalSettings = {
	theme: "light" | "dark" | "system";
	font: string;
};

type DashboardSettings = {
	title_pref: "english" | "romanized" | "native";
	visible_chips: string[];
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type SettingsData = ConditionalExcept<SettingsStore, Function>;

class SettingsStore {
	// global settings
	global = $state<GlobalSettings>({
		theme: "system",
		font: "Inter"
	});

	// dashboard settings
	dashboard = $state<DashboardSettings>({
		title_pref: "english",
		visible_chips: []
	});

	// utilities
	updateSettings(settings: PartialDeep<SettingsData>) {
		this.global = { ...this.global, ...settings.global };
		this.dashboard = { ...this.dashboard, ...settings.dashboard };

		// fire and forget
		this.saveSettings().catch((err) => logger.warn("failed to save settings:", err));
	}

	// Update settings from local storage.
	async loadSettings() {
		try {
			const settings = await localforage.getItem<SettingsStore>(StorageKeys.SETTINGS);
			if (settings) {
				this.updateSettings(settings);
			}
		} catch (err) {
			logger.warn("failed to load settings:", err);
		}
	}

	// Persist in local storage.
	async saveSettings() {
		const rawData: SettingsData = {
			global: $state.snapshot(this.global),
			dashboard: $state.snapshot(this.dashboard)
		};
		await localforage.setItem(StorageKeys.SETTINGS, rawData);
	}
}

export const settingsStore = new SettingsStore();
