import { ELR, Lexer } from "retsac";
import { Data, Context } from "../../../context/index.js";

export function applyControlFlowStmts<
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
    return builder
      .define(
        {
          if_stmt: `if exp '{' stmt@ifTrue* '}' (else '{' stmt@ifFalse* '}')?`,
        },
        (d) =>
          d.traverser(({ $$, $ }) => {
            const exp = $(`exp`)!.traverse()!;
            const ifTrue = $$(`ifTrue`).map((s) => s.traverse()!);
            const ifFalse = $$(`ifFalse`).map((s) => s.traverse()!);
            return ctx.mod.if(
              exp,
              ctx.mod.block(null, ifTrue),
              ctx.mod.block(null, ifFalse)
            );
          })
      )
      .define({ loop_stmt: `do '{' stmt* '}' while exp ';'` }, (d) =>
        d.traverser(({ $$, $ }) => {
          const stmts = $$(`stmt`).map((s) => s.traverse()!);
          const condition = $(`exp`)!.traverse()!;
          const label = ctx.lg.next();
          /**
           * loop $label {
           *   block { // no label
           *     stmt*
           *     br_if $label condition // if condition is true, jump to the start of the loop
           *   }
           * }
           */
          return ctx.mod.loop(
            label,
            ctx.mod.block(null, stmts.concat(ctx.mod.br(label, condition)))
          );
        })
      )
      .define({ loop_stmt: `while exp '{' stmt* '}'` }, (d) =>
        d.traverser(({ $$, $ }) => {
          const stmts = $$(`stmt`).map((s) => s.traverse()!);
          const condition = $(`exp`)!.traverse()!;
          const loopLabel = ctx.lg.next();
          const blockLabel = ctx.lg.next();
          /**
           * loop $loopLabel {
           *   block $blockLabel {
           *     br_if $blockLabel !condition // if condition is false, jump to the end of the block
           *     stmt*
           *     br $loopLabel // jump to the start of the loop
           *   }
           * }
           */
          return ctx.mod.loop(
            loopLabel,
            ctx.mod.block(
              blockLabel,
              [ctx.mod.br(blockLabel, ctx.mod.i32.eqz(condition))]
                .concat(stmts)
                .concat(ctx.mod.br(loopLabel))
            )
          );
        })
      );
  };
}
