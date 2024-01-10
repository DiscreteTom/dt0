import { ELR } from "retsac";
import type { ASTData } from "../context";
import { Context } from "../context";
import { buildLexer } from "../lexer";
import { applyAllRules } from "./rules";

export function newParserBuilder() {
  return new ELR.AdvancedBuilder({ lexer: buildLexer() })
    .data<ASTData>()
    .global(() => new Context())
    .define({ fn_defs: `fn_def+` }) // default traverser will traverse all children
    .use(applyAllRules);
}

export type DT0ParserBuilder = ReturnType<typeof newParserBuilder>;

export const entry = "fn_defs";
