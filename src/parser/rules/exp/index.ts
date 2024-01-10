import { add, applyMathRules, div, mul, neg, rem, sub } from "./math.js";
import binaryen from "binaryen";
import { and, applyLogicalRules, not, or } from "./logical.js";
import { applyComparisonRules, eq, ge, gt, le, lt, ne } from "./comparison.js";
import type { PartialParserBuilder } from "../../types.js";

export function applyExps<NTs extends string>(
  builder: PartialParserBuilder<NTs>,
) {
  return (
    builder
      .define({ exp: `integer` }, (d) =>
        d.traverser(
          ({ children, global }) =>
            // TODO: check if the number is in i32 range
            // TODO: use token data to get the number (with ASTNode children selector)
            global.mod.i32.const(parseInt(children[0].text!)), // [[integer to expression]]
        ),
      )
      .define({ exp: `identifier` }, (d) =>
        d.traverser(({ children, global }) => {
          const name = children[0].text!;
          const symbol = global.st.get(name);
          if (symbol.local)
            return global.mod.local.get(symbol.index, binaryen.i32);
          // else, it's global or undefined
          if (!symbol.exist) throw new Error(`Undefined symbol ${name}`); // TODO: use ASTNode error instead of throwing error
          return global.mod.global.get(name, binaryen.i32);
        }),
      )
      .use(applyMathRules)
      .use(applyLogicalRules)
      .use(applyComparisonRules)
      // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence#table
      .priority(
        [not, neg], // highest priority
        [mul, div, rem],
        [add, sub],
        [lt, le, gt, ge],
        [eq, ne],
        and,
        or, // lowest priority
      )
  );
}
