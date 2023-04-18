import { ELR, BuilderDecorator } from "retsac";
import { Data, Context } from "../../context.js";
import { applyMathRules } from "./math.js";
import binaryen from "binaryen";

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
          const name = children![0].text!;
          const symbol = ctx.st.get(name)!;
          if (symbol.local)
            return ctx.mod.local.get(symbol.index, binaryen.i32);
          // else, it's global or undefined
          if (!symbol.exist) throw new Error(`Undefined symbol ${name}`);
          return ctx.mod.global.get(name, binaryen.i32);
        })
      );
  };
}
