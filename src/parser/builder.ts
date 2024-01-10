import { ELR } from "retsac";
import type { ASTData } from "./types.js";
import { ASTGlobalFactory } from "./global/index.js";
import { buildLexer } from "../lexer/index.js";
import { applyAllRules } from "./rules/index.js";

export function newParserBuilder() {
  return new ELR.AdvancedBuilder({ lexer: buildLexer() })
    .data<ASTData>()
    .global(ASTGlobalFactory)
    .define({ fn_defs: `fn_def+` }) // default traverser will traverse all children
    .use(applyAllRules);
}

export type DT0ParserBuilder = ReturnType<typeof newParserBuilder>;

export const entry = "fn_defs";
