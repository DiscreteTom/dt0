# DT0

The **_minimal_** programming language that compiles to [WebAssembly](https://webassembly.org/) via [Binaryen](https://github.com/WebAssembly/binaryen). This is used to test/demo [retsac](https://github.com/DiscreteTom/retsac).

Since this is a **_minimal_** language, any advanced language features will not be implemented: struct, enum, class, closure, array, etc.

## Spec

Since retsac already makes it very easy to create a compiler, I recommend you to read the source code directly to understand the grammar specs.

For lexical specs, see [this file](https://github.com/DiscreteTom/dt0/blob/main/src/lexer/index.ts).

For grammar rules, see [this folder](https://github.com/DiscreteTom/dt0/tree/main/src/parser/rules).

## Limitations

For simplicity, these limitations are enforced by design:

- You can't define functions inside functions.
- No type system, `i32` is the only type.
- Every function is exported.
- Local variables defined in if/while blocks are accessible outside the block.
