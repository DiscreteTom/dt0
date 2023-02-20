import { ELR } from "retsac";
import { Type } from "../types";

export function applyMathRules<T>(builder: ELR.ParserBuilder<T>) {
  return builder
    .define(
      { exp: `integer` }
      // ELR.reducer((_, { matched }) => Type.)
    )
    .define({ exp: `exp "+" exp` })
    .define({ exp: `exp "-" exp` })
    .define({ exp: `exp "*" exp` })
    .define({ exp: `exp "/" exp` })
    .define({ exp: `"(" exp ")"` })
    .define({ exp: `"-" exp` });
}
