import binaryen from "binaryen";
import { LabelGenerator } from "./label-gen.js";
import { SymbolTable } from "./symbol-table.js";

/** The data of ASTNode. */
export type Data = binaryen.ExpressionRef;

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
    this.st = new SymbolTable();
    this.lg = new LabelGenerator();

    // set global symbols
    this.st.setGlobal("i32");
  }
}
