import binaryen from "binaryen";
import { SymbolTable } from "./symbol-table.js";
import { Type } from "./types.js";

/** The data of ASTNode. */
export type Data = binaryen.ExpressionRef;

/** The module. */
export const mod = new binaryen.Module();

/** Symbol table. */
export const st = new SymbolTable<Type>();

// set global symbols
st.setGlobal("i32", Type.Int32);