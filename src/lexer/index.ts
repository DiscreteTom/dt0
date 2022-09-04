import { Lexer } from "retsac";
import types from "../spec/types";

export let lexer = new Lexer.Builder()
  .ignore(/^\s/) // ignore blank chars
  .define(Lexer.wordType("fn", "return", "let")) // keywords
  .define(Lexer.wordType(...Object.keys(types))) // types
  .define({
    integer: /^([1-9][0-9]*|0)/,
    identifier: /^[a-zA-Z_]\w*/,
  })
  .anonymous(Lexer.exact(..."+-*/():{};=")) // single char operator
  .build();
