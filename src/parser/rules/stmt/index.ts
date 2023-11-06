import { ELR, Lexer } from "retsac";
import { Data, Context } from "../../context/index.js";
import { applyControlFlowStmts } from "./control-flow.js";
import { applyFnDefStmts } from "./fn-def.js";
import { applyUnaryOpStmts } from "./unary-op.js";

export function applyStmts<
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
      .use(applyFnDefStmts(ctx))
      .use(applyControlFlowStmts(ctx))
      .use(applyUnaryOpStmts(ctx))
      .define(
        {
          stmt: `assign_stmt | ret_stmt | incr_stmt | decr_stmt | if_stmt | loop_stmt`,
        },
        // commit the parsing result to prevent re-lexing
        // this will accelerate the parsing process
        (d) => d.commit()
      )
      .define({ assign_stmt: `let identifier '=' exp ';'` }, (d) =>
        d.traverser(({ $ }) => {
          const varName = $(`identifier`)!.text!;
          const exp = $(`exp`)!.traverse()!;
          const index = ctx.st.setLocal(varName); // update symbol table to record this var
          return ctx.mod.local.set(index, exp); // return the expression ref
        })
      )
      .define({ ret_stmt: `return exp ';'` }, (d) =>
        d.traverser(({ $ }) => ctx.mod.return($(`exp`)!.traverse()!))
      );
  };
}
