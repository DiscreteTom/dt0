import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context/index.js";
import { applyControlFlowStmts } from "./control-flow.js";
import { applyFnDefStmts } from "./fn-def.js";
import { applyUnaryOpStmts } from "./unary-op.js";

export function applyStmts(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
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
        ELR.commit()
      )
      .define(
        { assign_stmt: `let identifier '=' exp ';'` },
        ELR.traverser(({ $ }) => {
          const varName = $(`identifier`)[0].text!;
          const exp = $(`exp`)[0].traverse()!;
          const index = ctx.st.setLocal(varName); // update symbol table to record this var
          return ctx.mod.local.set(index, exp); // return the expression ref
        })
      )
      .define(
        { ret_stmt: `return exp ';'` },
        ELR.traverser<Data>(({ $ }) => ctx.mod.return($(`exp`)[0].traverse()!))
      );
  };
}
