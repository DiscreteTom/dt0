import binaryen from "binaryen";
import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context.js";

export function applyFnDefStmts(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
    return builder
      .define(
        {
          fn_def: `
            fn identifier '(' (param (',' param)*)? ')' '{'
              stmt*
            '}'
          `,
        },
        ELR.traverser<Data>(({ $ }) => {
          // create a new scope for this function
          ctx.st.enterFunc();

          const funcName = $(`identifier`)[0].text!;

          // init params
          $(`param`).forEach((p) => p.traverse());
          // calculate stmts
          const stmts = $(`stmt`).map((s) => s.traverse()!);

          ctx.mod.addFunction(
            funcName, // function name
            binaryen.createType(
              ctx.st.getParamTypes().map((t) => binaryen.i32)
            ), // params type
            binaryen.i32,
            ctx.st.getLocalTypes().map((t) => binaryen.i32), // local vars
            ctx.mod.block(null, stmts) // body
          );
          ctx.mod.addFunctionExport(funcName, funcName);

          ctx.st.exitFunc();
        }).commit()
      )
      .define(
        { param: `identifier` },
        ELR.traverser<Data>(({ $ }) => {
          // add param to symbol table
          ctx.st.setParam($(`identifier`)[0].text!);
        })
      );
  };
}
