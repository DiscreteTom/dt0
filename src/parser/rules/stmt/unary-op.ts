import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context.js";
import binaryen from "binaryen";

export function applyUnaryOpStmts(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
    return builder
      .define(
        { incr_stmt: `('++' identifier | identifier '++') ';'` },
        ELR.traverser(({ $ }) => {
          const name = $(`identifier`)[0].text!;
          const varInfo = ctx.st.get(name);
          if (varInfo.local)
            return ctx.mod.local.set(
              varInfo.index,
              ctx.mod.i32.add(
                ctx.mod.local.get(varInfo.index, binaryen.i32),
                ctx.mod.i32.const(1)
              )
            );
          // else, it's global or undefined
          if (!varInfo.exist) throw new Error(`Undefined symbol ${name}`);
          return ctx.mod.global.set(
            name,
            ctx.mod.i32.add(
              ctx.mod.global.get(name, binaryen.i32),
              ctx.mod.i32.const(1)
            )
          );
        })
      )
      .define(
        { decr_stmt: `('--' identifier | identifier '--') ';'` },
        ELR.traverser(({ $ }) => {
          const name = $(`identifier`)[0].text!;
          const varInfo = ctx.st.get(name);
          if (varInfo.local)
            return ctx.mod.local.set(
              varInfo.index,
              ctx.mod.i32.sub(
                ctx.mod.local.get(varInfo.index, binaryen.i32),
                ctx.mod.i32.const(1)
              )
            );
          // else, it's global or undefined
          if (!varInfo.exist) throw new Error(`Undefined symbol ${name}`);
          return ctx.mod.global.set(
            name,
            ctx.mod.i32.sub(
              ctx.mod.global.get(name, binaryen.i32),
              ctx.mod.i32.const(1)
            )
          );
        })
      );
  };
}
