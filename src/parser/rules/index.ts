import { ELR } from "retsac";
import { Data } from "../context";
import { applyExps } from "./exp";
import { applyStmts } from "./stmt";

export function applyAllRules(builder: ELR.IParserBuilder<Data>) {
  return builder.use(applyStmts).use(applyExps);
}
