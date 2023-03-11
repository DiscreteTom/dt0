import { ELR } from "retsac";
import { Context, Data } from "../context";
import { applyExps } from "./exp";
import { applyStmts } from "./stmt";

export function applyAllRules(ctx: Context) {
  return (builder: ELR.IParserBuilder<Data>) => {
    return builder.use(applyStmts(ctx)).use(applyExps(ctx));
  };
}
