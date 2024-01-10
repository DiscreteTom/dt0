import type { PartialParserBuilder } from "../../../context/index.js";

export const add = Object.freeze({ exp: `exp '+' exp` });
export const sub = Object.freeze({ exp: `exp "-" exp` });
export const mul = Object.freeze({ exp: `exp "*" exp` });
export const div = Object.freeze({ exp: `exp "/" exp` });
export const rem = Object.freeze({ exp: `exp "%" exp` });
export const neg = Object.freeze({ exp: `"-" exp` });

export function applyMathRules<NTs extends string>(
  builder: PartialParserBuilder<NTs | "exp">, // ensure `exp` is defined
) {
  return builder
    .define(add, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.add(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(sub, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.sub(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(mul, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.mul(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(div, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.div_s(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(rem, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.rem_s(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(neg, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.sub(global.mod.i32.const(0), children[1].traverse()!),
      ),
    );
}
