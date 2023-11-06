import { ELR, Lexer } from "retsac";
import { Context, Data } from "../../context/index.js";

export function applyMathRules<
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
      .define({ exp: `exp '+' exp` }, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.add(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define({ exp: `exp "-" exp` }, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.sub(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define({ exp: `exp "*" exp` }, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.mul(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define({ exp: `exp "/" exp` }, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.div_s(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define({ exp: `exp "%" exp` }, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.rem_s(children![0].traverse()!, children![2].traverse()!)
        )
      )
      .define({ exp: `"-" exp` }, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.sub(ctx.mod.i32.const(0), children![1].traverse()!)
        )
      );
  };
}
