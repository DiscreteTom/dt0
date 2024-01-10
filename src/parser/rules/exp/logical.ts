import type { PartialParserBuilder } from "../../context/index.js";

export const and = Object.freeze({ exp: `exp '&&' exp` });
export const or = Object.freeze({ exp: `exp "||" exp` });
export const not = Object.freeze({ exp: `"!" exp` });

export function applyLogicalRules<NTs extends string>(
  builder: PartialParserBuilder<NTs | "exp">, // ensure `exp` is defined
) {
  return builder
    .define(and, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.and(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(or, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.or(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(not, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.xor(children[1].traverse()!, global.mod.i32.const(1)),
      ),
    );
}
