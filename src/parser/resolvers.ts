import { ELR } from "retsac";

export function applyResolvers<T>(builder: ELR.IParserBuilder<T>) {
  return builder
    .priority(
      { exp: `'-' exp` },
      [{ exp: `exp '*' exp` }, { exp: `exp '/' exp` }, { exp: `exp '%' exp` }],
      [{ exp: `exp '+' exp` }, { exp: `exp '-' exp` }]
    )
    .leftSA(
      { exp: `exp '+' exp` },
      { exp: `exp '-' exp` },
      { exp: `exp '*' exp` },
      { exp: `exp '/' exp` },
      { exp: `exp '%' exp` }
    );
}
