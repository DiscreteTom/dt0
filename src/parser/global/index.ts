import binaryen from "binaryen";
import { LabelGenerator } from "./label-gen.js";
import { SymbolTable } from "./symbol-table.js";

export function ASTGlobalFactory() {
  const mod = new binaryen.Module();
  const st = new SymbolTable(mod);
  const lg = new LabelGenerator();

  // set global symbols
  st.setGlobal("i32");

  return Object.freeze({
    /** The binaryen module. */
    mod,
    /** Symbol table. */
    st,
    /** Label generator. */
    lg,
  });
}

export type ASTGlobal = ReturnType<typeof ASTGlobalFactory>;
