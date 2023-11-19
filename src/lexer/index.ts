import { Lexer } from "retsac";

/**
 * Preserved words in the language.
 * Preserved words are words that cannot be used as identifiers.
 */
const preserved = ["fn", "return", "if", "else", "do", "while"] as const;
const preservedSet = new Set(preserved) as ReadonlySet<string>;

export function buildLexer() {
  return new Lexer.Builder()
    .error<string>()
    .ignore(
      Lexer.whitespaces(), // ignore blank chars
      Lexer.comment("//"), // single line comment
      Lexer.comment("/*", "*/"), // multiline comment
    )
    .define(Lexer.wordKind(...preserved)) // preserved words
    .define({
      integer: Lexer.javascript
        .numericLiteral() // use lexer utils for easy error handling
        .data((ctx) => {
          const raw = ctx.output.data.invalid
            ? NaN
            : Number(ctx.output.content);
          return Object.freeze({
            /**
             * The raw value, must be a number, might be `NaN`.
             */
            raw,
            /**
             * The integer's value, must be an integer.
             * If this is not an integer (`NaN` or `float`), it will be `0`.
             */
            value: Number.isInteger(raw) ? raw : 0,
          });
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
      identifier: Lexer.Action.from(/[a-zA-Z_]\w*/)
        // exclude preserved words
        .reject((ctx) => preservedSet.has(ctx.output.content)),
    })
    .anonymous(
      // operators
      // as a best practice, put the longer operators first
      Lexer.exact("&&", "||"), // logical
      Lexer.exact("==", "!=", "<=", ">="), // double char comparison
      Lexer.exact("<<", ">>"), // double char bitwise
      Lexer.exact("="), // assignment
      Lexer.exact("<", ">"), // single char comparison
      Lexer.exact("+", "-", "*", "/", "%"), // arithmetic
      Lexer.exact("&", "|", "^", "~"), // single char bitwise
      Lexer.exact(...":,(){};"), // others
    )
    .build();
}
