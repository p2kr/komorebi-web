import { Blocks, Flame, Globe, House, Vault, WandSparkles } from "@lucide/svelte";

export const appRoutes = Object.freeze({
	"/dashboard": {
		label: "Dashboard",
		icon: House
	},
	"/discover": {
		label: "Discover",
		icon: Flame
	},
	"/crawler/matcher": {
		label: "Smart Matcher",
		icon: WandSparkles
	},
	"/crawler/sandbox": {
		label: "Crawler Sanbox",
		icon: Blocks
	},
	"/vault": {
		label: "Vault",
		icon: Vault
	},
	"/browser": {
		label: "Browser",
		icon: Globe
	}
});
