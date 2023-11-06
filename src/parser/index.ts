import { ELR } from "retsac";
import { buildLexer } from "../lexer/index.js";
import { Data, Context } from "../context/index.js";
import { applyResolvers } from "./resolvers.js";
import { applyAllRules } from "./rules/index.js";
import { CompilerOptions } from "../model.js";
import { profile } from "../utils.js";

export function buildParser(ctx: Context, options?: CompilerOptions) {
  return profile(
    `build parser`,
    options?.profile,
    () =>
      new ELR.AdvancedBuilder()
        .data<Data>()
        .lexer(buildLexer())
        .define({ fn_defs: `fn_def+` }, (d) =>
          d.traverser(({ $$ }) => {
            $$(`fn_def`).map((s) => s.traverse()!);
          })
        )
        .use(applyAllRules(ctx))
        .use(applyResolvers)
        .build({
          entry: "fn_defs",
          checkAll: options?.checkAll, // for dev
          debug: options?.debug, // for debug
          // generateResolvers: "builder", // for debug
        }).parser
  );
}
