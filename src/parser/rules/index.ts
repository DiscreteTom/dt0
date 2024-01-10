import { applyExps } from "./exp/index.js";
import { applyStmts } from "./stmt/index.js";
import type { PartialParserBuilder } from "../../context/index.js";

export function applyAllRules<NTs extends string>(
  builder: PartialParserBuilder<NTs>,
) {
  return builder.use(applyStmts).use(applyExps);
}
