import type { ELR, Lexer } from "retsac";
import type { Context, Data } from "../../../context/index.js";

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
  ) => {
    const eq = { exp: `exp '==' exp` }; // equal
    const ne = { exp: `exp "!=" exp` }; // not equal
    const gt = { exp: `exp ">" exp` }; // greater than
    const lt = { exp: `exp "<" exp` }; // less than
    const ge = { exp: `exp ">=" exp` }; // greater than or equal
    const le = { exp: `exp "<=" exp` }; // less than or equal

    return builder
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
      )
      .priority([lt, le, gt, ge], [eq, ne]);
  };
}
