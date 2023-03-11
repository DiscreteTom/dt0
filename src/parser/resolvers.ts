import { ELR } from "retsac";

export function applyResolvers<T>(builder: ELR.IParserBuilder<T>) {
  return builder
    .resolveRS(
      { exp: `exp '+' exp` },
      { exp: `exp '+' exp` },
      { next: `'+'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '+' exp` },
      { exp: `exp '-' exp` },
      { next: `'-'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '+' exp` },
      { exp: `exp '*' exp` },
      { next: `'*'`, reduce: false }
    )
    .resolveRS(
      { exp: `exp '+' exp` },
      { exp: `exp '/' exp` },
      { next: `'/'`, reduce: false }
    )
    .resolveRS(
      { exp: `exp '+' exp` },
      { exp: `exp '%' exp` },
      { next: `'%'`, reduce: false }
    )
    .resolveRS(
      { exp: `exp '-' exp` },
      { exp: `exp '+' exp` },
      { next: `'+'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '-' exp` },
      { exp: `exp '-' exp` },
      { next: `'-'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '-' exp` },
      { exp: `exp '*' exp` },
      { next: `'*'`, reduce: false }
    )
    .resolveRS(
      { exp: `exp '-' exp` },
      { exp: `exp '/' exp` },
      { next: `'/'`, reduce: false }
    )
    .resolveRS(
      { exp: `exp '-' exp` },
      { exp: `exp '%' exp` },
      { next: `'%'`, reduce: false }
    )
    .resolveRS(
      { exp: `exp '*' exp` },
      { exp: `exp '+' exp` },
      { next: `'+'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '*' exp` },
      { exp: `exp '-' exp` },
      { next: `'-'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '*' exp` },
      { exp: `exp '*' exp` },
      { next: `'*'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '*' exp` },
      { exp: `exp '/' exp` },
      { next: `'/'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '*' exp` },
      { exp: `exp '%' exp` },
      { next: `'%'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '/' exp` },
      { exp: `exp '+' exp` },
      { next: `'+'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '/' exp` },
      { exp: `exp '-' exp` },
      { next: `'-'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '/' exp` },
      { exp: `exp '*' exp` },
      { next: `'*'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '/' exp` },
      { exp: `exp '/' exp` },
      { next: `'/'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '/' exp` },
      { exp: `exp '%' exp` },
      { next: `'%'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '%' exp` },
      { exp: `exp '+' exp` },
      { next: `'+'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '%' exp` },
      { exp: `exp '-' exp` },
      { next: `'-'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '%' exp` },
      { exp: `exp '*' exp` },
      { next: `'*'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '%' exp` },
      { exp: `exp '/' exp` },
      { next: `'/'`, reduce: true }
    )
    .resolveRS(
      { exp: `exp '%' exp` },
      { exp: `exp '%' exp` },
      { next: `'%'`, reduce: true }
    )
    .resolveRS(
      { exp: `'-' exp` },
      { exp: `exp '+' exp` },
      { next: `'+'`, reduce: true }
    )
    .resolveRS(
      { exp: `'-' exp` },
      { exp: `exp '-' exp` },
      { next: `'-'`, reduce: true }
    )
    .resolveRS(
      { exp: `'-' exp` },
      { exp: `exp '*' exp` },
      { next: `'*'`, reduce: true }
    )
    .resolveRS(
      { exp: `'-' exp` },
      { exp: `exp '/' exp` },
      { next: `'/'`, reduce: true }
    )
    .resolveRS(
      { exp: `'-' exp` },
      { exp: `exp '%' exp` },
      { next: `'%'`, reduce: true }
    );
}
