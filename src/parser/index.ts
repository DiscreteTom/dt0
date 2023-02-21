import binaryen from "binaryen";
import { ELR } from "retsac";
import { lexer } from "../lexer/index.js";
// import { applyMathRules } from "./rules/";
import { st } from "./symbol-table/index.js";

export const mod = new binaryen.Module();

type Data = {
  value?: binaryen.ExpressionRef;
  array?: binaryen.ExpressionRef[];
};

const builder = new ELR.ParserBuilder<Data>()
  .entry("fn_def")
  .define(
    {
      fn_def: `
        pub fn identifier '(' ')' ':' identifier '{'
          stmts
        '}'
      `,
    },
    ELR.traverser<Data>(({ $ }) => {
      // create a new scope for this function
      st.pushScope();

      const funcName = $(`identifier`)!.text!;
      const retTypeName = $(`identifier`, 1)!.text!;
      const stmts = $(`stmts`)!.traverse()!.array!; // stmts's data is an array

      mod.addFunction(
        funcName, // function name
        binaryen.none, // params type
        st.get(retTypeName)!.type.prototype, // return type
        [], // params
        mod.block(null, stmts) // body
      );
      mod.addFunctionExport(funcName, funcName);

      st.popScope();
    }).commit()
  )
  .define(
    { stmts: `stmt` },
    ELR.traverser(({ children }) => ({
      array: [children![0].traverse()!.value!],
    }))
  )
  .define(
    { stmts: `stmts stmt` },
    ELR.traverser(({ children }) => ({
      array: [
        ...children![0].traverse()!.array!,
        children![1].traverse()!.value!,
      ],
    }))
  )
  // use default traverser
  .define({ stmt: `assign_stmt | ret_stmt` })
  .define(
    { assign_stmt: `let identifier ':' identifier '=' exp ';'` },
    ELR.traverser(({ $ }) => {
      const name = $(`identifier`)!.text!;
      const varTypeSymbol = st.get($(`identifier`, 1)!.text!)!;
      const exp = $(`exp`)!.traverse()!.value!;

      st.set(name, varTypeSymbol.type); // update symbol table to record this var
      return { value: mod.local.set(st.get(name)!.index, exp) }; // return the expression ref
    })
  )
  .define(
    { ret_stmt: `return exp ';'` },
    ELR.traverser<Data>(({ $ }) => ({
      value: mod.return($(`exp`)!.traverse()!.value!), // return the expression ref
    }))
  )
  .define(
    { exp: `integer` },
    ELR.traverser<Data>(({ children }) => ({
      value: mod.i32.const(parseInt(children![0].text!)),
    }))
  )
  .define(
    { exp: `identifier` },
    ELR.traverser<Data>(({ children }) => {
      const symbol = st.get(children![0].text!)!;
      return { value: mod.local.get(symbol.index, symbol.type.prototype) };
    })
  )
  .define(
    { exp: `exp '+' exp` },
    ELR.traverser<Data>(({ children }) => ({
      value: children![0].traverse()!.value! + children![2].traverse()!.value!,
    }))
  )
  .resolveRS(
    { exp: `exp '+' exp` },
    { exp: `exp '+' exp` },
    { next: `'+'`, reduce: true }
  );

// builder.generateResolvers(lexer);

// applyMathRules(builder);

// check all, comment this line when production to improve performance
builder.checkAll(lexer.getTokenTypes(), lexer);

export const parser = builder.build(lexer, true);
