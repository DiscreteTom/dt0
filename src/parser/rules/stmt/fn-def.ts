import binaryen from "binaryen";
import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context/index.js";

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
          ctx.st.withinFunc(() => {
            // init params
            $(`param`).forEach((p) => p.traverse());
            // calculate stmts
            const stmts = $(`stmt`).map((s) => s.traverse()!);

            // add function to module and export it
            const funcName = $(`identifier`)[0].text!;
            ctx.mod.addFunction(
              // function name
              funcName,
              // params type
              binaryen.createType(ctx.st.getParamTypes()),
              // return type
              binaryen.i32,
              // local vars
              ctx.st.getLocalTypes(),
              // body
              ctx.mod.block(null, stmts)
            );
            ctx.mod.addFunctionExport(funcName, funcName);
          });
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
