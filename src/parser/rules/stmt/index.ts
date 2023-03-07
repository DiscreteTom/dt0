import { ELR } from "retsac";
import { Data, mod, st, lg } from "../../context";
import { applyUnaryOpStmts } from "./unary-op";

export function applyStmts(builder: ELR.AdvancedBuilder<Data>) {
  applyUnaryOpStmts(builder);

  return builder
    .define(
      {
        stmt: `assign_stmt | ret_stmt | incr_stmt | decr_stmt | if_stmt | loop_stmt`,
      },
      ELR.commit()
    )
    .define(
      {
        assign_stmt: `let identifier@varName ':' identifier@typeName '=' exp ';'`,
      },
      ELR.traverser(({ $ }) => {
        const varName = $(`varName`)[0].text!;
        const typeInfo = st.get($(`typeName`)[0].text!)!;
        const exp = $(`exp`)[0].traverse()!;

        st.setLocal(varName, typeInfo.type); // update symbol table to record this var
        return mod.local.set(st.get(varName)!.index, exp); // return the expression ref
      })
    )
    .define(
      { if_stmt: `if exp '{' stmt@ifTrue* '}' (else '{' stmt@ifFalse* '}')?` },
      ELR.traverser<Data>(({ $ }) => {
        const exp = $(`exp`)[0].traverse()!;

        st.pushScope(); // push a new scope for ifTrue
        const ifTrue = $(`ifTrue`).map((s) => s.traverse()!);
        st.popScope(); // pop the scope for ifTrue

        st.pushScope(); // push a new scope for ifFalse
        const ifFalse = $(`ifFalse`).map((s) => s.traverse()!);
        st.popScope(); // pop the scope for ifFalse

        return mod.if(exp, mod.block(null, ifTrue), mod.block(null, ifFalse));
      })
    )
    .define(
      { ret_stmt: `return exp ';'` },
      ELR.traverser<Data>(({ $ }) => mod.return($(`exp`)[0].traverse()!))
    )
    .define(
      { loop_stmt: `do '{' stmt* '}' while exp ';'` },
      ELR.traverser<Data>(({ $ }) => {
        st.pushScope(); // push a new scope for loop
        const stmts = $(`stmt`).map((s) => s.traverse()!);
        const exp = $(`exp`)[0].traverse()!;
        st.popScope(); // pop the scope for loop
        const label = lg.next();
        return mod.loop(
          label,
          mod.block(null, stmts.concat(mod.br(label, exp)))
        );
      })
    );
}
