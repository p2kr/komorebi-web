import { createConsola, LogLevels } from "consola";

export const logger = createConsola({
	level: import.meta.env.DEV ? 999 : LogLevels.warn
});
