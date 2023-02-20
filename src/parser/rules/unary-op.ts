import { ELR } from "retsac";

export function applyUnary<T>(builder: ELR.ParserBuilder<T>) {
  return builder
    .define({ incr_stmt: `'++' identifier` })
    .define({ incr_stmt: `identifier '++'` })
    .define({ decr_stmt: `'--' identifier` })
    .define({ decr_stmt: `identifier '--'` });
}
