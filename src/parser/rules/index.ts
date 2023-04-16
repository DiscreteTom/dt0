import { ELR } from "retsac";
import { Context, Data } from "../context.js";
import { applyExps } from "./exp/index.js";
import { applyStmts } from "./stmt/index.js";

export function applyAllRules(ctx: Context) {
  return (builder: ELR.IParserBuilder<Data>) => {
    return builder.use(applyStmts(ctx)).use(applyExps(ctx));
  };
}
