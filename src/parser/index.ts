import binaryen from "binaryen";
import { ELR } from "retsac";
import { lexer } from "../lexer/index.js";
// import { applyMathRules } from "./rules/";
import { st } from "./symbol-table/index.js";

export const mod = new binaryen.Module();

type Data = binaryen.ExpressionRef;

const builder = new ELR.AdvancedBuilder<Data>()
  .define(
    {
      fn_def: `
        pub fn identifier@funcName '(' (param (',' param)*)? ')' ':' identifier@retTypeName '{'
          stmt*
        '}'
      `,
    },
    ELR.traverser<Data>(({ $ }) => {
      // create a new scope for this function
      st.enterFunc();

      const funcName = $(`funcName`)[0].text!;
      const retTypeName = $(`retTypeName`)[0].text!;
      const stmts = $(`stmt`).map((s) => s.traverse()!);

      mod.addFunction(
        funcName, // function name
        binaryen.none, // params type
        st.get(retTypeName)!.type.prototype, // return type
        st.getFuncLocalTypes().map((t) => t.prototype), // local vars
        mod.block(null, stmts) // body
      );
      mod.addFunctionExport(funcName, funcName);

      st.exitFunc();
    }).commit()
  )
  .define(
    { param: `identifier@varName ':' identifier@typeName` },
    ELR.traverser<Data>(({ $ }) => {
      // TODO
    })
  )
  .define({ stmt: `assign_stmt | ret_stmt` }) // use default traverser
  .define(
    {
      assign_stmt: `let identifier@varName ':' identifier@typeName '=' exp ';'`,
    },
    ELR.traverser(({ $ }) => {
      const varName = $(`varName`)[0].text!;
      const typeInfo = st.get($(`typeName`)[0].text!)!;
      const exp = $(`exp`)[0].traverse()!;

      st.set(varName, typeInfo.type); // update symbol table to record this var
      return mod.local.set(st.get(varName)!.index, exp); // return the expression ref
    })
  )
  .define(
    { ret_stmt: `return exp ';'` },
    ELR.traverser<Data>(({ $ }) => mod.return($(`exp`)[0].traverse()!))
  )
  .define(
    { exp: `integer` },
    ELR.traverser<Data>(({ children }) =>
      mod.i32.const(parseInt(children![0].text!))
    )
  )
  .define(
    { exp: `identifier` },
    ELR.traverser<Data>(({ children }) => {
      const symbol = st.get(children![0].text!)!;
      return mod.local.get(symbol.index, symbol.type.prototype);
    })
  )
  .define(
    { exp: `exp '+' exp` },
    ELR.traverser<Data>(({ children }) =>
      mod.i32.add(children![0].traverse()!, children![2].traverse()!)
    )
  )
  .expand()
  .entry("fn_def")
  .resolveRS(
    { exp: `exp '+' exp` },
    { exp: `exp '+' exp` },
    { next: `'+'`, reduce: true }
  );

// builder.generateResolvers(lexer);

// applyMathRules(builder);

// check all, comment this line when production to improve performance
builder.checkAll(lexer.getTokenTypes(), lexer);

export const parser = builder.build(lexer);
