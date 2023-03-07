import binaryen from "binaryen";
import { ELR } from "retsac";
import { Data, mod, st } from "../../context";

export function applyFnDefStmts(builder: ELR.AdvancedBuilder<Data>) {
  return builder
    .define(
      {
        fn_def: `
        pub fn identifier@funcName '(' (param (',' param)*)? ')' ':' identifier@retTypeName '{'
          stmt*
        '}'
      `,
      },
      ELR.traverser<Data>(({ $ }) => {
        // create a new scope for this function
        st.enterFunc();

        const funcName = $(`funcName`)[0].text!;
        const retTypeName = $(`retTypeName`)[0].text!;

        // init params
        $(`param`).forEach((p) => p.traverse());
        // calculate stmts
        const stmts = $(`stmt`).map((s) => s.traverse()!);

        mod.addFunction(
          funcName, // function name
          binaryen.createType(st.getParamTypes().map((t) => t.prototype)), // params type
          st.get(retTypeName)!.type.prototype, // return type
          st.getLocalTypes().map((t) => t.prototype), // local vars
          mod.block(null, stmts) // body
        );
        mod.addFunctionExport(funcName, funcName);

        st.exitFunc();
      }).commit()
    )
    .define(
      { param: `identifier@varName ':' identifier@typeName` },
      ELR.traverser<Data>(({ $ }) => {
        // add param to symbol table
        st.setParam(
          $(`varName`)[0].text!,
          st.get($(`typeName`)[0].text!)!.type
        );
      })
    );
}
