import { SymbolTable } from "./symbol-table.js";
import { Type } from "../types.js";

export const st = new SymbolTable<Type>();

// set global symbols
st.setGlobal("i32", Type.Int32);
