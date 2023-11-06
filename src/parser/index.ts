import { ELR } from "retsac";
import { buildLexer } from "../lexer/index.js";
import { Data, Context } from "../context/index.js";
import { applyResolvers } from "./resolvers.js";
import { applyAllRules } from "./rules/index.js";
import { CompilerBuildOptions } from "../model.js";
import { profile } from "../utils.js";

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
      }).parser
  );
}
