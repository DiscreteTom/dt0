import { ELR } from "retsac";
import { Data, mod, st, lg } from "../../context";

export function applyControlFlowStmts(builder: ELR.AdvancedBuilder<Data>) {
  return builder
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
