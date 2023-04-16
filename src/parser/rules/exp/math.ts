import { ELR } from "retsac";
import { Context, Data } from "../../context.js";

export function applyMathRules(ctx: Context) {
  return (builder: ELR.IParserBuilder<Data>) => {
    return builder
      .define(
        { exp: `exp '+' exp` },
        ELR.traverser<Data>(({ children }) =>
          ctx.mod.i32.add(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define(
        { exp: `exp "-" exp` },
        ELR.traverser<Data>(({ children }) =>
          ctx.mod.i32.sub(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define(
        { exp: `exp "*" exp` },
        ELR.traverser<Data>(({ children }) =>
          ctx.mod.i32.mul(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define(
        { exp: `exp "/" exp` },
        ELR.traverser<Data>(({ children }) =>
          ctx.mod.i32.div_s(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define(
        { exp: `exp "%" exp` },
        ELR.traverser<Data>(({ children }) =>
          ctx.mod.i32.rem_s(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define(
        { exp: `"-" exp` },
        ELR.traverser(({ children }) =>
          ctx.mod.i32.sub(ctx.mod.i32.const(0), children![1].traverse()!)
        )
      );
  };
}
