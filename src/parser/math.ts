import { LR } from "retsac";
import llvm from "llvm-bindings";
import { ASTData } from "./model";

export function getMathParser(builder: llvm.IRBuilder) {
  const mathParser = new LR.ParserBuilder<ASTData>()
    .define(
      { exp: `'-' exp` },
      LR.dataReducer(
        (values) => () => builder.CreateNeg(values[1]() as llvm.Value)
      ),
      ({ before }) => before?.at(-1).type == "exp"
    )
    .define(
      { exp: `exp '+' exp` },
      LR.dataReducer(
        (values) => () =>
          builder.CreateAdd(
            values[0]() as llvm.Value,
            values[2]() as llvm.Value
          )
      ),
      ({ after }) => ["*", "/"].includes(after?.[0]?.text)
    )
    .define(
      { exp: `exp '-' exp` },
      LR.dataReducer(
        (values) => () =>
          builder.CreateSub(
            values[0]() as llvm.Value,
            values[2]() as llvm.Value
          )
      ),
      ({ after }) => ["*", "/"].includes(after?.[0]?.text)
    )
    .define(
      { exp: `exp '*' exp` },
      LR.dataReducer(
        (values) => () =>
          builder.CreateMul(
            values[0]() as llvm.Value,
            values[2]() as llvm.Value
          )
      )
    )
    .define(
      { exp: `exp '/' exp` },
      LR.dataReducer(
        (values) => () =>
          builder.CreateSDiv(
            values[0]() as llvm.Value,
            values[2]() as llvm.Value
          )
      )
    )
    .define(
      { exp: `'(' exp ')'` },
      LR.dataReducer((values) => values[1])
    );

  return mathParser;
}
