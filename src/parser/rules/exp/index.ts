import { ELR } from "retsac";
import { Data, Context } from "../../context";
import { applyMathRules } from "./math";

export function applyExps(ctx: Context) {
  return (builder: ELR.IParserBuilder<Data>) => {
    return builder
      .use(applyMathRules(ctx))
      .define(
        { exp: `integer` },
        ELR.traverser<Data>(({ children }) =>
          ctx.mod.i32.const(parseInt(children![0].text!))
        )
      )
      .define(
        { exp: `identifier` },
        ELR.traverser<Data>(({ children }) => {
          const symbol = ctx.st.get(children![0].text!)!;
          return ctx.mod.local.get(symbol.index, symbol.type.prototype);
        })
      );
  };
}
