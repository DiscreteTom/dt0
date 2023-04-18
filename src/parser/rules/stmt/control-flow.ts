import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context/index.js";

export function applyControlFlowStmts(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
    return builder
      .define(
        {
          if_stmt: `if exp '{' stmt@ifTrue* '}' (else '{' stmt@ifFalse* '}')?`,
        },
        ELR.traverser<Data>(({ $ }) => {
          const exp = $(`exp`)[0].traverse()!;
          const ifTrue = $(`ifTrue`).map((s) => s.traverse()!);
          const ifFalse = $(`ifFalse`).map((s) => s.traverse()!);
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
          const stmts = $(`stmt`).map((s) => s.traverse()!);
          const exp = $(`exp`)[0].traverse()!;
          const label = ctx.lg.next();
          return ctx.mod.loop(
            label,
            ctx.mod.block(null, stmts.concat(ctx.mod.br(label, exp)))
          );
        })
      );
  };
}
