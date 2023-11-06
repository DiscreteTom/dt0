import { ELR, Lexer } from "retsac";
import { Data, Context } from "../../../context/index.js";
import { applyMathRules } from "./math.js";
import binaryen from "binaryen";

export function applyExps<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType
>(ctx: Context) {
  return (
    builder: ELR.IParserBuilder<
      Kinds,
      Data,
      ErrorType,
      LexerDataBindings,
      LexerActionState,
      LexerErrorType
    >
  ) => {
    return builder
      .use(applyMathRules(ctx))
      .define({ exp: `integer` }, (d) =>
        d.traverser(({ children }) =>
          // TODO: check if the number is in range
          ctx.mod.i32.const(parseInt(children![0].text!))
        )
      )
      .define({ exp: `identifier` }, (d) =>
        d.traverser(({ children }) => {
          const name = children![0].text!;
          const symbol = ctx.st.get(name);
          if (symbol.local)
            return ctx.mod.local.get(symbol.index, binaryen.i32);
          // else, it's global or undefined
          if (!symbol.exist) throw new Error(`Undefined symbol ${name}`);
          return ctx.mod.global.get(name, binaryen.i32);
        })
      );
  };
}
