import { ELR } from "retsac";
import { buildLexer } from "../lexer/index.js";
import type { Data, Context } from "../context/index.js";
import { applyResolvers } from "./resolvers.js";
import { applyAllRules } from "./rules/index.js";
import type { CompilerBuildOptions } from "../model.js";
import { profile } from "../utils.js";
import { serialized } from "./serialized.js";

export function newParserBuilder(ctx: Context) {
  return new ELR.AdvancedBuilder()
    .data<Data>()
    .lexer(buildLexer())
    .define({ fn_defs: `fn_def+` }) // default traverser will traverse all children
    .use(applyAllRules(ctx))
    .use(applyResolvers);
}

export const entry = "fn_defs";

export function buildParser(ctx: Context, options?: CompilerBuildOptions) {
  return profile(
    `build parser`,
    options?.profile,
    () =>
      newParserBuilder(ctx).build({
        entry,
        checkAll: options?.checkAll, // for dev
        debug: options?.debug, // for debug
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hydrate: serialized as any, // TODO: fix type
      }).parser,
  );
}
