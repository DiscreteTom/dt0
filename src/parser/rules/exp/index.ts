import { ELR } from "retsac";
import { Data, mod, st } from "../../context";
import { applyMathRules } from "./math";

export function applyExps(builder: ELR.AdvancedBuilder<Data>) {
  applyMathRules(builder);

  return builder
    .define(
      { exp: `integer` },
      ELR.traverser<Data>(({ children }) =>
        mod.i32.const(parseInt(children![0].text!))
      )
    )
    .define(
      { exp: `identifier` },
      ELR.traverser<Data>(({ children }) => {
        const symbol = st.get(children![0].text!)!;
        return mod.local.get(symbol.index, symbol.type.prototype);
      })
    );
}
