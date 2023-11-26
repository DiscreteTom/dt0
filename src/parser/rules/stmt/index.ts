import type { ELR, Lexer } from "retsac";
import type { Data, Context } from "../../../context/index.js";
import { applyControlFlowStmts } from "./control-flow.js";
import { applyFnDefStmts } from "./fn-def.js";

export function applyStmts<
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
    return builder
      .use(applyFnDefStmts(ctx))
      .use(applyControlFlowStmts(ctx))
      .define(
        {
          stmt: `assign_stmt | ret_stmt | incr_stmt | decr_stmt | if_stmt | loop_stmt`,
        },
        // commit the parsing result to prevent re-lexing
        // this will accelerate the parsing process
        (d) => d.commit(),
      )
      .define({ assign_stmt: `identifier '=' exp ';'` }, (d) =>
        d.traverser(({ $ }) => {
          const name = $(`identifier`)!.text!;
          const value = $(`exp`)!.traverse()!;
          return ctx.st.set(name, value);
        }),
      )
      .define({ ret_stmt: `return exp ';'` }, (d) =>
        d.traverser(({ $ }) => ctx.mod.return($(`exp`)!.traverse()!)),
      );
  };
}
