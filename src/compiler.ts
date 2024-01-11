import type { CompileOptions, CompilerBuildOptions } from "./options.js";
import type { DT0Parser } from "./parser/index.js";
import { buildParser } from "./parser/index.js";
import { profile } from "./utils.js";

export class Compiler {
  private readonly parser: DT0Parser;

  constructor(options?: CompilerBuildOptions) {
    this.parser = buildParser(options);
  }

  private parse(code: string, options?: CompileOptions) {
    // parse input to AST
    const res = profile(`parse`, options?.profile, () =>
      this.parser.reset().parseAll(code),
    );
    if (!res.accept) throw new Error("Parse error");

    // TODO: print all errors

    // traverse AST to generate binaryen module
    profile(`traverse`, options?.profile, () => res.buffer[0].traverse());

    // optimize and validate
    if (options?.optimize ?? true)
      profile(`optimize`, options?.profile, () =>
        this.parser.global.mod.optimize(),
      );
    if (
      !profile(`validate`, options?.profile, () =>
        this.parser.global.mod.validate(),
      )
    )
      throw new Error("Module is invalid");
  }

  /**
   * Compile code to WebAssembly text format.
   */
  emitText(code: string, options?: CompileOptions) {
    this.parse(code, options);
    return this.parser.global.mod.emitText();
  }

  /**
   * Compile code to WebAssembly binary format.
   */
  emitBinary(code: string, options?: CompileOptions) {
    this.parse(code, options);
    return this.parser.global.mod.emitBinary();
  }

  /**
   * Compile code to WebAssembly instance.
   */
  compile(code: string, options?: CompileOptions) {
    return new WebAssembly.Instance(
      new WebAssembly.Module(this.emitBinary(code, options)),
      options?.importObject,
    );
  }
}
