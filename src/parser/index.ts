import type { CompilerBuildOptions } from "../options.js";
import { profile } from "../utils.js";
import { serialized } from "./serialized.js";
import { newParserBuilder, entry } from "./builder.js";

export function buildParser(options?: CompilerBuildOptions) {
  return profile(
    `build parser`,
    options?.profile,
    () =>
      newParserBuilder().build({
        entry,
        checkAll: options?.checkAll, // for dev
        debug: options?.debug, // for debug
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrate: serialized,
      }).parser,
  );
}

export type DT0Parser = ReturnType<typeof buildParser>;
