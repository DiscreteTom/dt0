import type { ELR, Lexer } from "retsac";
import type { Context, Data } from "../../../context/index.js";

export function applyLogicalRules<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType,
>(ctx: Context) {
  return (
    builder: ELR.IParserBuilder<
      Kinds | "exp", // ensure `exp` is defined
      Data,
      ErrorType,
      LexerDataBindings,
      LexerActionState,
      LexerErrorType
    >,
  ) => {
    const and = { exp: `exp '&&' exp` };
    const or = { exp: `exp "||" exp` };
    const not = { exp: `"!" exp` };

    return (
      builder
        .define(and, (d) =>
          d.traverser(({ children }) =>
            ctx.mod.i32.and(children[0].traverse()!, children[2].traverse()!),
          ),
        )
        .define(or, (d) =>
          d.traverser(({ children }) =>
            ctx.mod.i32.or(children[0].traverse()!, children[2].traverse()!),
          ),
        )
        .define(not, (d) =>
          d.traverser(({ children }) =>
            ctx.mod.i32.xor(children[1].traverse()!, ctx.mod.i32.const(1)),
          ),
        )
        // `not` has higher priority than `and` and `or`
        // `and` has higher priority than `or`
        .priority(not, and, or)
    );
  };
}
