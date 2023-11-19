import type { ELR, Lexer } from "retsac";
import type { Context, Data } from "../../../context/index.js";

export const eq = Object.freeze({ exp: `exp '==' exp` }); // equal
export const ne = Object.freeze({ exp: `exp "!=" exp` }); // not equal
export const gt = Object.freeze({ exp: `exp ">" exp` }); // greater than
export const lt = Object.freeze({ exp: `exp "<" exp` }); // less than
export const ge = Object.freeze({ exp: `exp ">=" exp` }); // greater than or equal
export const le = Object.freeze({ exp: `exp "<=" exp` }); // less than or equal

export function applyComparisonRules<
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
  ) =>
    builder
      .define(eq, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.eq(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(ne, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.ne(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(gt, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.gt_s(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(lt, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.lt_s(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(ge, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.ge_s(children[0].traverse()!, children[2].traverse()!),
        ),
      )
      .define(le, (d) =>
        d.traverser(({ children }) =>
          ctx.mod.i32.le_s(ctx.mod.i32.const(0), children[1].traverse()!),
        ),
      );
}
