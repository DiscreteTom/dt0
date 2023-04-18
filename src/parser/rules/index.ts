import { BuilderDecorator } from "retsac";
import { Context, Data } from "../context/index.js";
import { applyExps } from "./exp/index.js";
import { applyStmts } from "./stmt/index.js";

export function applyAllRules(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
    return builder.use(applyStmts(ctx)).use(applyExps(ctx));
  };
}
