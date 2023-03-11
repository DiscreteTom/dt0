import { ELR } from "retsac";
import { Data, mod, st } from "../../context";

export function applyUnaryOpStmts(builder: ELR.IParserBuilder<Data>) {
  return builder
    .define(
      { incr_stmt: `('++' identifier | identifier '++') ';'` },
      ELR.traverser(({ $ }) => {
        const varInfo = st.get($(`identifier`)[0].text!)!;
        return mod.local.set(
          varInfo.index,
          mod.i32.add(
            mod.local.get(varInfo.index, varInfo.type.prototype),
            mod.i32.const(1)
          )
        );
      })
    )
    .define(
      { decr_stmt: `('--' identifier | identifier '--') ';'` },
      ELR.traverser(({ $ }) => {
        const varInfo = st.get($(`identifier`)[0].text!)!;
        return mod.local.set(
          varInfo.index,
          mod.i32.sub(
            mod.local.get(varInfo.index, varInfo.type.prototype),
            mod.i32.const(1)
          )
        );
      })
    );
}
