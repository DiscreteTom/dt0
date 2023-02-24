import { ELR } from "retsac";
import { Data, mod, st } from "../../context.js";
import { applyUnaryOpStmts } from "./unary-op.js";

export function applyStmts(builder: ELR.AdvancedBuilder<Data>) {
  applyUnaryOpStmts(builder);

  return builder
    .define({ stmt: `assign_stmt | ret_stmt | incr_stmt | decr_stmt` }) // use default traverser
    .define(
      {
        assign_stmt: `let identifier@varName ':' identifier@typeName '=' exp ';'`,
      },
      ELR.traverser(({ $ }) => {
        const varName = $(`varName`)[0].text!;
        const typeInfo = st.get($(`typeName`)[0].text!)!;
        const exp = $(`exp`)[0].traverse()!;

        st.set(varName, typeInfo.type); // update symbol table to record this var
        return mod.local.set(st.get(varName)!.index, exp); // return the expression ref
      })
    )
    .define(
      { ret_stmt: `return exp ';'` },
      ELR.traverser<Data>(({ $ }) => mod.return($(`exp`)[0].traverse()!))
    );
}
