import { ELR } from "retsac";
import { Data, Context } from "../../context";

export function applyControlFlowStmts(ctx: Context) {
  return (builder: ELR.IParserBuilder<Data>) => {
    return builder
      .define(
        {
          if_stmt: `if exp '{' stmt@ifTrue* '}' (else '{' stmt@ifFalse* '}')?`,
        },
        ELR.traverser<Data>(({ $ }) => {
          const exp = $(`exp`)[0].traverse()!;

          ctx.st.pushScope(); // push a new scope for ifTrue
          const ifTrue = $(`ifTrue`).map((s) => s.traverse()!);
          ctx.st.popScope(); // pop the scope for ifTrue

          ctx.st.pushScope(); // push a new scope for ifFalse
          const ifFalse = $(`ifFalse`).map((s) => s.traverse()!);
          ctx.st.popScope(); // pop the scope for ifFalse

          return ctx.mod.if(
            exp,
            ctx.mod.block(null, ifTrue),
            ctx.mod.block(null, ifFalse)
          );
        })
      )
      .define(
        { loop_stmt: `do '{' stmt* '}' while exp ';'` },
        ELR.traverser<Data>(({ $ }) => {
          ctx.st.pushScope(); // push a new scope for loop
          const stmts = $(`stmt`).map((s) => s.traverse()!);
          const exp = $(`exp`)[0].traverse()!;
          ctx.st.popScope(); // pop the scope for loop
          const label = ctx.lg.next();
          return ctx.mod.loop(
            label,
            ctx.mod.block(null, stmts.concat(ctx.mod.br(label, exp)))
          );
        })
      );
  };
}
