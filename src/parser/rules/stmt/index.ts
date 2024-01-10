import { applyControlFlowStmts } from "./control-flow.js";
import { applyFnDefStmts } from "./fn-def.js";
import type { PartialParserBuilder } from "../../types.js";

export function applyStmts<NTs extends string>(
  builder: PartialParserBuilder<NTs>,
) {
  return builder
    .use(applyFnDefStmts)
    .use(applyControlFlowStmts)
    .define(
      {
        stmt: `assign_stmt | ret_stmt | if_stmt | loop_stmt`,
      },
      // commit the parsing result to prevent re-lexing
      // this will accelerate the parsing process
      (d) => d.commit(),
    )
    .define({ assign_stmt: `identifier '=' exp ';'` }, (d) =>
      d.traverser(({ $, global }) => {
        const name = $(`identifier`)!.text;
        const value = $(`exp`)!.traverse()!;
        return global.st.set(name, value);
      }),
    )
    .define({ ret_stmt: `return exp ';'` }, (d) =>
      d.traverser(({ $, global }) => global.mod.return($(`exp`)!.traverse()!)),
    );
}
