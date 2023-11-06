import { ELR, Lexer } from "retsac";
import { Context, Data } from "../../context/index.js";
import { applyExps } from "./exp/index.js";
import { applyStmts } from "./stmt/index.js";

export function applyAllRules<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType
>(ctx: Context) {
  return (
    builder: ELR.IParserBuilder<
      Kinds,
      Data,
      ErrorType,
      LexerDataBindings,
      LexerActionState,
      LexerErrorType
    >
  ) => {
    return builder.use(applyStmts(ctx)).use(applyExps(ctx));
  };
}
