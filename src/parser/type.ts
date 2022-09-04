import types from "../spec/types";
import { LR } from "retsac";
import llvm from "llvm-bindings";
import { ASTData } from "./model";

export function getTypeParser(builder: llvm.IRBuilder) {
  const typeParser = new LR.ParserBuilder<ASTData>();

  for (const name in types) {
    typeParser.define(
      { type: name },
      LR.dataReducer(() => () => types[name](builder))
    );
  }

  return typeParser;
}
