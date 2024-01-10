import type { PartialParserBuilder } from "../../context/index.js";

export const eq = Object.freeze({ exp: `exp '==' exp` }); // equal
export const ne = Object.freeze({ exp: `exp "!=" exp` }); // not equal
export const gt = Object.freeze({ exp: `exp ">" exp` }); // greater than
export const lt = Object.freeze({ exp: `exp "<" exp` }); // less than
export const ge = Object.freeze({ exp: `exp ">=" exp` }); // greater than or equal
export const le = Object.freeze({ exp: `exp "<=" exp` }); // less than or equal

export function applyComparisonRules<NTs extends string>(
  builder: PartialParserBuilder<NTs | "exp">, // ensure `exp` is defined
) {
  return builder
    .define(eq, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.eq(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(ne, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.ne(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(gt, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.gt_s(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(lt, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.lt_s(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(ge, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.ge_s(children[0].traverse()!, children[2].traverse()!),
      ),
    )
    .define(le, (d) =>
      d.traverser(({ children, global }) =>
        global.mod.i32.le_s(global.mod.i32.const(0), children[1].traverse()!),
      ),
    );
}
