import types from "../spec/types";
import { LR } from "retsac";
import llvm from "llvm-bindings";
import { ASTData } from "./model";

/** Provide the NT `type`. */
export function getTypeParser(builder: llvm.IRBuilder) {
  const p = new LR.ParserBuilder<ASTData>();

  for (const name in types) {
    p.define(
      { type: name },
      LR.dataReducer(() => () => types[name](builder))
    );
  }

  return p;
}
