import binaryen from "binaryen";
import type { PartialParserBuilder } from "../../context/index.js";

export function applyFnDefStmts<NTs extends string>(
  builder: PartialParserBuilder<NTs>,
) {
  return builder
    .define(
      {
        fn_def: `
            fn identifier '(' (param (',' param)*)? ')' '{'
              stmt*
            '}'
          `,
      },
      (d) =>
        d
          .traverser(({ $$, $, global }) => {
            global.st.withinFunc(() => {
              // init params
              $$(`param`).forEach((p) => p.traverse());
              // calculate stmts
              const stmts = $$(`stmt`).map((s) => s.traverse()!);

              // add function to module and export it
              const funcName = $(`identifier`)!.text;
              global.mod.addFunction(
                // function name
                funcName,
                // params type
                binaryen.createType(global.st.getParamTypes()),
                // return type
                binaryen.i32,
                // local vars
                global.st.getLocalTypes(),
                // body
                global.mod.block(null, stmts),
              );
              global.mod.addFunctionExport(funcName, funcName);
            });
          })
          .commit(),
    )
    .define({ param: `identifier` }, (d) =>
      d.traverser(({ $, global }) => {
        // add param to symbol table
        global.st.setParam($(`identifier`)!.text);
      }),
    );
}
