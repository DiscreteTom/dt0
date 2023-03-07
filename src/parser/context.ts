import binaryen from "binaryen";
import { LabelGenerator } from "./label-gen";
import { SymbolTable } from "./symbol-table";
import { Type } from "./types";

/** The data of ASTNode. */
export type Data = binaryen.ExpressionRef;

/** The module. */
export const mod = new binaryen.Module();

/** Symbol table. */
export const st = new SymbolTable<Type>();

// set global symbols
st.setGlobal("i32", Type.Int32);

export const lg = new LabelGenerator();
