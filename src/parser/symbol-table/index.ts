import { SymbolTable } from "./symbol-table.js";
import { Type } from "../types.js";

export const st = new SymbolTable<Type>();

// set global symbols
st.set("void", Type.Void);
st.set("bool", Type.Bool);
st.set("i32", Type.Int32);
