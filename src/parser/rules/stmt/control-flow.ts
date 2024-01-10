import type { PartialParserBuilder } from "../../../context/index.js";

export function applyControlFlowStmts<NTs extends string>(
  builder: PartialParserBuilder<NTs>,
) {
  return builder
    .define(
      { if_stmt: `if exp '{' stmt@ifTrue* '}' (else '{' stmt@ifFalse* '}')?` },
      (d) =>
        d.traverser(({ $$, $, global }) => {
          const exp = $(`exp`)!.traverse()!;
          const ifTrue = $$(`ifTrue`).map((s) => s.traverse()!);
          const ifFalse = $$(`ifFalse`).map((s) => s.traverse()!);
          return global.mod.if(
            exp,
            global.mod.block(null, ifTrue),
            global.mod.block(null, ifFalse),
          );
        }),
    )
    .define({ loop_stmt: `do '{' stmt* '}' while exp ';'` }, (d) =>
      d.traverser(({ $$, $, global }) => {
        const stmts = $$(`stmt`).map((s) => s.traverse()!);
        const condition = $(`exp`)!.traverse()!;
        const label = global.lg.next();
        /**
         * loop $label {
         *   block { // no label
         *     stmt*
         *     br_if $label condition // if condition is true, jump to the start of the loop
         *   }
         * }
         */
        return global.mod.loop(
          label,
          global.mod.block(null, stmts.concat(global.mod.br(label, condition))),
        );
      }),
    )
    .define({ loop_stmt: `while exp '{' stmt* '}'` }, (d) =>
      d.traverser(({ $$, $, global }) => {
        const stmts = $$(`stmt`).map((s) => s.traverse()!);
        const condition = $(`exp`)!.traverse()!;
        const loopLabel = global.lg.next();
        const blockLabel = global.lg.next();
        /**
         * loop $loopLabel {
         *   block $blockLabel {
         *     br_if $blockLabel !condition // if condition is false, jump to the end of the block
         *     stmt*
         *     br $loopLabel // jump to the start of the loop
         *   }
         * }
         */
        return global.mod.loop(
          loopLabel,
          global.mod.block(
            blockLabel,
            [global.mod.br(blockLabel, global.mod.i32.eqz(condition))]
              .concat(stmts)
              .concat(global.mod.br(loopLabel)),
          ),
        );
      }),
    );
}
