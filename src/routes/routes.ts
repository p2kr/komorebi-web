import { m } from "$lib/paraglide/messages";
import { Blocks, Flame, Globe, House, Vault, WandSparkles } from "@lucide/svelte";

export const appRoutes = Object.freeze({
	"/dashboard": {
		label: m.dashboard(),
		icon: House
	},
	"/discover": {
		label: m.discover(),
		icon: Flame
	},
	"/crawler/matcher": {
		label: m.smart_matcher(),
		icon: WandSparkles
	},
	"/crawler/sandbox": {
		label: m.crawler_sandbox(),
		icon: Blocks
	},
	"/vault": {
		label: m.vault(),
		icon: Vault
	},
	"/browser": {
		label: m.browser(),
		icon: Globe
	}
});
