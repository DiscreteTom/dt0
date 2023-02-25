import { ELR } from "retsac";
import { Data, mod } from "../../context";

export function applyMathRules(builder: ELR.AdvancedBuilder<Data>) {
  return builder
    .define(
      { exp: `exp '+' exp` },
      ELR.traverser<Data>(({ children }) =>
        mod.i32.add(children![0].traverse()!, children![2].traverse()!)
      )
    )
    .define(
      { exp: `exp "-" exp` },
      ELR.traverser<Data>(({ children }) =>
        mod.i32.sub(children![0].traverse()!, children![2].traverse()!)
      )
    )
    .define(
      { exp: `exp "*" exp` },
      ELR.traverser<Data>(({ children }) =>
        mod.i32.mul(children![0].traverse()!, children![2].traverse()!)
      )
    )
    .define(
      { exp: `exp "/" exp` },
      ELR.traverser<Data>(({ children }) =>
        mod.i32.div_s(children![0].traverse()!, children![2].traverse()!)
      )
    )
    .define(
      { exp: `exp "%" exp` },
      ELR.traverser<Data>(({ children }) =>
        mod.i32.rem_s(children![0].traverse()!, children![2].traverse()!)
      )
    )
    .define(
      { exp: `"-" exp` },
      ELR.traverser(({ children }) =>
        mod.i32.sub(mod.i32.const(0), children![1].traverse()!)
      )
    );
}
