import { Lexer } from "retsac";

export const lexer = new Lexer.Builder()
  .ignore(/^\s/) // ignore blank chars
  .define(
    // keywords
    Lexer.wordType("fn", "return", "let", "if", "else", "do", "while")
  )
  .define({
    integer: /^([1-9][0-9]*|0)/,
    identifier: /^[a-zA-Z_]\w*/,
  })
  .anonymous(Lexer.exact("&&", "||", "++", "--")) // double char operator
  .anonymous(Lexer.exact(..."+-*/():{};=,%")) // single char operator
  .build();
