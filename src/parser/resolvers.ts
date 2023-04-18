import { ELR } from "retsac";

export function applyResolvers<T>(builder: ELR.IParserBuilder<T>) {
  return builder
    .priority(
      { exp: `'-' exp` }, // highest priority
      [{ exp: `exp '*' exp` }, { exp: `exp '/' exp` }, { exp: `exp '%' exp` }],
      [{ exp: `exp '+' exp` }, { exp: `exp '-' exp` }] // lowest priority
    )
    .leftSA(
      { exp: `exp '+' exp` },
      { exp: `exp '-' exp` },
      { exp: `exp '*' exp` },
      { exp: `exp '/' exp` },
      { exp: `exp '%' exp` }
    );
}
