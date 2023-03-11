import binaryen from "binaryen";
import { LabelGenerator } from "./label-gen";
import { SymbolTable } from "./symbol-table";
import { Type } from "./types";

/** The data of ASTNode. */
export type Data = binaryen.ExpressionRef;

export class Context {
  /** The module. */
  readonly mod: binaryen.Module;
  /** Symbol table. */
  readonly st: SymbolTable<Type>;
  /** Label generator. */
  readonly lg: LabelGenerator;

  constructor() {
    this.mod = new binaryen.Module();
    this.st = new SymbolTable<Type>();
    this.lg = new LabelGenerator();

    // set global symbols
    this.st.setGlobal("i32", Type.Int32);
  }
}
