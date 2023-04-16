import binaryen from "binaryen";
import { BuilderDecorator, ELR } from "retsac";
import { Data, Context } from "../../context.js";

export function applyFnDefStmts(ctx: Context): BuilderDecorator<Data> {
  return (builder) => {
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
          ctx.st.enterFunc();

          const funcName = $(`funcName`)[0].text!;
          const retTypeName = $(`retTypeName`)[0].text!;

          // init params
          $(`param`).forEach((p) => p.traverse());
          // calculate stmts
          const stmts = $(`stmt`).map((s) => s.traverse()!);

          ctx.mod.addFunction(
            funcName, // function name
            binaryen.createType(ctx.st.getParamTypes().map((t) => t.prototype)), // params type
            ctx.st.get(retTypeName)!.type.prototype, // return type
            ctx.st.getLocalTypes().map((t) => t.prototype), // local vars
            ctx.mod.block(null, stmts) // body
          );
          ctx.mod.addFunctionExport(funcName, funcName);

          ctx.st.exitFunc();
        }).commit()
      )
      .define(
        { param: `identifier@varName ':' identifier@typeName` },
        ELR.traverser<Data>(({ $ }) => {
          // add param to symbol table
          ctx.st.setParam(
            $(`varName`)[0].text!,
            ctx.st.get($(`typeName`)[0].text!)!.type
          );
        })
      );
  };
}
