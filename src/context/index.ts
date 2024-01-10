import binaryen from "binaryen";
import { LabelGenerator } from "./label-gen.js";
import { SymbolTable } from "./symbol-table.js";
import type { buildLexer } from "../lexer/index.js";
import type { Lexer } from "retsac";
import type { IParserBuilder } from "retsac/out/parser/ELR/index.js";

export type LexerErrorType = string;
export type LexerActionState = never;
export type LexerDataBindings = ReturnType<
  typeof buildLexer
> extends Lexer.ILexer<infer DataBindings, LexerActionState, LexerErrorType>
  ? DataBindings
  : never;
export type ASTData = binaryen.ExpressionRef;
export type ParserError = never;
export type PartialParserBuilder<NTs extends string> = IParserBuilder<
  NTs,
  ASTData,
  ParserError,
  LexerDataBindings,
  LexerActionState,
  LexerErrorType,
  Context
>;

/**
 * The context of the compiler.
 * This is used in `ASTNode.traverse`.
 */
export class Context {
  /** The module. */
  readonly mod: binaryen.Module;
  /** Symbol table. */
  readonly st: SymbolTable;
  /** Label generator. */
  readonly lg: LabelGenerator;

  constructor() {
    this.mod = new binaryen.Module();
    this.st = new SymbolTable(this.mod);
    this.lg = new LabelGenerator();

    // set global symbols
    this.st.setGlobal("i32");
  }
}
