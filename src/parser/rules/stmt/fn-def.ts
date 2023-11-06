import binaryen from "binaryen";
import { ELR, Lexer } from "retsac";
import { Data, Context } from "../../../context/index.js";

export function applyFnDefStmts<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType
>(ctx: Context) {
  return (
    builder: ELR.IParserBuilder<
      Kinds,
      Data,
      ErrorType,
      LexerDataBindings,
      LexerActionState,
      LexerErrorType
    >
  ) => {
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
            .traverser(({ $$ }) => {
              ctx.st.withinFunc(() => {
                // init params
                $$(`param`).forEach((p) => p.traverse());
                // calculate stmts
                const stmts = $$(`stmt`).map((s) => s.traverse()!);

                // add function to module and export it
                const funcName = $$(`identifier`)[0].text!;
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
            })
            .commit()
      )
      .define({ param: `identifier` }, (d) =>
        d.traverser(({ $ }) => {
          // add param to symbol table
          ctx.st.setParam($(`identifier`)!.text!);
        })
      );
  };
}
