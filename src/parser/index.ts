import { LR } from "retsac";
import { lexer } from "../lexer";
import llvm from "llvm-bindings";
import { getTypeParser } from "./type";
import { ASTData } from "./model";
import { getMathParser } from "./math";

export function getParser({
  module,
  context,
  builder,
}: {
  module: llvm.Module;
  context: llvm.LLVMContext;
  builder: llvm.IRBuilder;
}) {
  /** Symbol table. */
  const st = new Map<string, llvm.Value>();

  return new LR.ParserBuilder<ASTData>()
    .entry("fn_def_stmt")
    .define(
      {
        fn_def_stmt: `
             fn identifier '(' ')' ':' type '{' 
               func_body_stmts
             '}'
           `,
      },
      LR.dataReducer((data, { matched }) => () => {
        const func = llvm.Function.Create(
          llvm.FunctionType.get(data[5]() as llvm.Type, false),
          llvm.Function.LinkageTypes.ExternalLinkage,
          matched[1].text,
          module
        );
        const entryBB = llvm.BasicBlock.Create(context, "entry", func);
        builder.SetInsertPoint(entryBB);

        data[7](); // construct function body from 'func_body_stmts'

        if (llvm.verifyFunction(func)) {
          throw new Error("Verifying function failed");
        }
      })
    )
    .define(
      { func_body_stmts: `func_body_stmt` },
      LR.dataReducer((data) => data[0])
    )
    .define(
      { func_body_stmts: `func_body_stmts func_body_stmt` },
      LR.dataReducer((data) => () => {
        data[0]();
        data[1]();
      })
    )
    .define(
      { func_body_stmt: `return_stmt` },
      LR.dataReducer((data) => data[0])
    )
    .define(
      { func_body_stmt: `assign_stmt` },
      LR.dataReducer((data) => data[0])
    )
    .define(
      { return_stmt: `return exp ';'` },
      LR.dataReducer((data) => () => builder.CreateRet(data[1]() as llvm.Value))
    )
    .define(
      { exp: "integer" },
      LR.dataReducer(
        (_, { matched }) =>
          () =>
            builder.getInt32(parseInt(matched[0].text))
      )
    )
    .define(
      { exp: `identifier` },
      LR.dataReducer(
        (_, { matched }) =>
          () =>
            st.get(matched[0].text)
      )
    )
    .define(
      { assign_stmt: `let identifier '=' exp ';'` },
      LR.dataReducer((data, { matched }) => () => {
        st.set(matched[1].text, data[3]() as llvm.Value);
      })
    )
    .use(getTypeParser(builder))
    .use(getMathParser(builder))
    .checkSymbols(lexer.getTokenTypes())
    .build();
}
