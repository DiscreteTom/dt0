import { ELR, Lexer } from "retsac";
import { Data } from "./context";

export function applyResolvers<
  Kinds extends string,
  ErrorType,
  LexerDataBindings extends Lexer.GeneralTokenDataBinding,
  LexerActionState,
  LexerErrorType
>(
  builder: ELR.IParserBuilder<
    Kinds | "exp",
    Data,
    ErrorType,
    LexerDataBindings,
    LexerActionState,
    LexerErrorType
  >
) {
  return builder.priority(
    { exp: `'-' exp` }, // highest priority
    [{ exp: `exp '*' exp` }, { exp: `exp '/' exp` }, { exp: `exp '%' exp` }],
    [{ exp: `exp '+' exp` }, { exp: `exp '-' exp` }] // lowest priority
  );
}
