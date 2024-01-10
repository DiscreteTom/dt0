import binaryen from "binaryen";
import { LabelGenerator } from "./label-gen.js";
import { SymbolTable } from "./symbol-table.js";
import type { ELR } from "retsac";
import type {
  LexerActionState,
  LexerDataBindings,
  LexerErrorType,
} from "../../lexer/index.js";

export type ASTData = binaryen.ExpressionRef;
export type ParserError = never;
export type PartialParserBuilder<NTs extends string> = ELR.IParserBuilder<
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
