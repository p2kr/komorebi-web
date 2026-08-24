import { getTitle } from "$lib/core/utils";
import type { MediaTitle } from "$lib/models/media";
import { settingsStore } from "$lib/store/settings.svelte";
import {
	FILTER_CONFIGS,
	type FilterDefinition,
	type FilterOption,
	type MediaClientParams
} from "./dashboard_config";

class DashboardStore {
	filters = $state<MediaClientParams>(
		Object.fromEntries(
			FILTER_CONFIGS.map((cfg) => [cfg.key, cfg.defaultValue])
		) as MediaClientParams
	);

	updateFilter(key: string, value: string | number | boolean | undefined) {
		this.filters[key] = value;
	}

	get configs() {
		return FILTER_CONFIGS;
	}

	get activeConfigs() {
		return FILTER_CONFIGS.filter((cfg) => !cfg.isVisible || cfg.isVisible(this.filters));
	}

	getOptions(config: FilterDefinition): FilterOption[] {
		if (!config.options) return [];
		if (typeof config.options === "function") {
			return config.options(this.filters);
		}
		return config.options;
	}

	getTriggerLabel(config: FilterDefinition): string {
		const currentValue = this.filters[config.key];
		const options = this.getOptions(config);
		const selected = options.find((opt) => opt.value === currentValue);
		return selected?.label ?? config.placeholder ?? "Select...";
	}

	resetFilters() {
		for (const cfg of FILTER_CONFIGS) {
			this.filters[cfg.key] = cfg.defaultValue;
		}
	}
}

export const dashboardStore = new DashboardStore();

export function getPrimaryTitle(mediaTitle: MediaTitle): string {
	return getTitle(mediaTitle, settingsStore.dashboard.title_pref);
}

export function getSecondaryTitle(mediaTitle: MediaTitle): string {
	switch (settingsStore.dashboard.title_pref) {
		case "english":
			return getTitle(mediaTitle, "romanized");
		case "romanized":
			return getTitle(mediaTitle, "english");
		case "native":
			return getTitle(mediaTitle, "english");
	}
}
