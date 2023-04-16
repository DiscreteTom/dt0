import { ELR, BuilderDecorator } from "retsac";
import { Data, Context } from "../../context.js";
import { applyMathRules } from "./math.js";

export function applyExps(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
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
