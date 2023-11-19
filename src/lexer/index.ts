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
        .numericLiteral() // use lexer utils for easy error handling
        .data((ctx) => {
          const raw = ctx.output.data.invalid
            ? NaN
            : Number(ctx.output.content);
          return {
            /**
             * The raw value, must be a number, might be `NaN`.
             */
            raw,
            /**
             * The integer's value, must be an integer.
             * If this is not an integer (`NaN` or `float`), it will be `0`.
             */
            value: Number.isInteger(raw) ? raw : 0,
          };
        })
        .check(
          (ctx) =>
            Number.isNaN(ctx.output.data.raw)
              ? "Invalid numeric literal"
              : !Number.isInteger(ctx.output.data.raw)
              ? "Only integer is supported"
              : undefined,
          // don't check if the number is in range
          // because when parsing the parser will check it
          // and convert the value to a suitable type like i8/i32/u32/...
          // see [[@integer to expression]]
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
