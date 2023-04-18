import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context.js";
import binaryen from "binaryen";

export function applyUnaryOpStmts(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
    return builder
      .define(
        { incr_stmt: `('++' identifier | identifier '++') ';'` },
        ELR.traverser(({ $ }) => {
          const varInfo = ctx.st.get($(`identifier`)[0].text!)!;
          return ctx.mod.local.set(
            varInfo.index,
            ctx.mod.i32.add(
              ctx.mod.local.get(varInfo.index, binaryen.i32),
              ctx.mod.i32.const(1)
            )
          );
        })
      )
      .define(
        { decr_stmt: `('--' identifier | identifier '--') ';'` },
        ELR.traverser(({ $ }) => {
          const varInfo = ctx.st.get($(`identifier`)[0].text!)!;
          return ctx.mod.local.set(
            varInfo.index,
            ctx.mod.i32.sub(
              ctx.mod.local.get(varInfo.index, binaryen.i32),
              ctx.mod.i32.const(1)
            )
          );
        })
      );
  };
}
