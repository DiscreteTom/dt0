import { ELR } from "retsac";
import { Data } from "../context";
import { applyExps } from "./exp";
import { applyStmts } from "./stmt";

export function applyAll(builder: ELR.AdvancedBuilder<Data>) {
  applyStmts(builder);
  applyExps(builder);
}
