import type { ELR, Lexer } from "retsac";
import type { Context, Data } from "../../../context/index.js";

export function applyMathRules<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType,
>(ctx: Context) {
  return (
    builder: ELR.IParserBuilder<
      Kinds,
      Data,
      ErrorType,
      LexerDataBindings,
      LexerActionState,
      LexerErrorType
    >,
  ) => {
    const add = { exp: `exp '+' exp` };
    const sub = { exp: `exp "-" exp` };
    const mul = { exp: `exp "*" exp` };
    const div = { exp: `exp "/" exp` };
    const rem = { exp: `exp "%" exp` };
    const neg = { exp: `"-" exp` };

    return builder
      .define(add, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.add(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(sub, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.sub(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(mul, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.mul(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(div, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.div_s(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(rem, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.rem_s(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(neg, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.sub(ctx.mod.i32.const(0), children[1].traverse()!),
        ),
      )
      .priority(
        neg, // highest priority
        [mul, div, rem],
        [add, sub], // lowest priority
      );
  };
}
