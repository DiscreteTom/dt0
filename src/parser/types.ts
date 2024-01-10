import type binaryen from "binaryen";
import type { ELR } from "retsac";
import type {
  LexerDataBindings,
  LexerActionState,
  LexerErrorType,
} from "../lexer/index.js";
import type { Context } from "./context/index.js";

export type ASTData = binaryen.ExpressionRef;
export type ParserError = never;
export type PartialParserBuilder<NTs extends string> = ELR.IParserBuilder<
  NTs,
  ASTData,
  ParserError,
  LexerDataBindings,
  LexerActionState,
  LexerErrorType,
  Context
>;
