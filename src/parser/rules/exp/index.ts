import type { ELR, Lexer } from "retsac";
import type { Data, Context } from "../../../context/index.js";
import { add, applyMathRules, div, mul, neg, rem, sub } from "./math.js";
import binaryen from "binaryen";
import { and, applyLogicalRules, not, or } from "./logical.js";
import { applyComparisonRules, eq, ge, gt, le, lt, ne } from "./comparison.js";

export function applyExps<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType,
>(ctx: Context) {
  return (
    builder: ELR.IParserBuilder<
      Kinds,
      Data,
      ErrorType,
      LexerDataBindings,
      LexerActionState,
      LexerErrorType
    >,
  ) => {
    return (
      builder
        .define({ exp: `integer` }, (d) =>
          d.traverser(
            ({ children }) =>
              // TODO: check if the number is in i32 range
              // TODO: use token data to get the number (with ASTNode children selector)
              ctx.mod.i32.const(parseInt(children[0].text!)), // [[integer to expression]]
          ),
        )
        .define({ exp: `identifier` }, (d) =>
          d.traverser(({ children }) => {
            const name = children[0].text!;
            const symbol = ctx.st.get(name);
            if (symbol.local)
              return ctx.mod.local.get(symbol.index, binaryen.i32);
            // else, it's global or undefined
            if (!symbol.exist) throw new Error(`Undefined symbol ${name}`); // TODO: use ASTNode error instead of throwing error
            return ctx.mod.global.get(name, binaryen.i32);
          }),
        )
        .use(applyMathRules(ctx))
        .use(applyLogicalRules(ctx))
        .use(applyComparisonRules(ctx))
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
  };
}
