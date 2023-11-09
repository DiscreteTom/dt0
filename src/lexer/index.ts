import { Lexer } from "retsac";
import { comments, identifier, operators, preserved } from "./spec.js";

const preservedSet = new Set(preserved) as Set<string>;

const allOperators = [] as string[];
for (const key in operators) {
  allOperators.push(...operators[key as keyof typeof operators]);
}
allOperators.sort();

export function buildLexer() {
  return new Lexer.Builder()
    .error<string>()
    .ignore(
      Lexer.whitespaces(), // ignore blank chars
      Lexer.comment(comments.singleLine), // single line comment
      Lexer.comment(...comments.multiLine), // multiline comment
    )
    .define(Lexer.wordKind(...preserved))
    .define({
      integer: Lexer.javascript
        .numericLiteral()
        .data((ctx) => {
          const value = ctx.output.data.invalid
            ? NaN
            : Number(ctx.output.content);
          return {
            /** If `true`, the numeric literal is invalid. */
            invalid: ctx.output.data.invalid,
            /**
             * The integer's value.
             * `undefined` if the integer is invalid or the number is a float.
             */
            integer: Number.isInteger(value) ? value : undefined,
            /**
             * `true` if the number is a float.
             */
            float: !Number.isInteger(value),
          };
        })
        .check((ctx) =>
          ctx.output.data.invalid
            ? "Invalid numeric literal"
            : ctx.output.data.float
            ? "Float is not supported"
            : undefined,
        ),
      identifier: Lexer.Action.from(identifier)
        // exclude preserved words
        .reject((ctx) => preservedSet.has(ctx.output.content)),
    })
    .anonymous(
      Lexer.exact(...allOperators), // operators
    )
    .build();
}
