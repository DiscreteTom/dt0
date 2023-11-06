import { Context } from "./context";
import { CompileOptions, CompilerBuildOptions } from "./model";
import { buildParser } from "./parser";
import { profile } from "./utils";

export class Compiler {
  private readonly parser: ReturnType<typeof buildParser>;
  private readonly ctx: Context;

  constructor(options?: CompilerBuildOptions) {
    this.ctx = new Context();

    // build parser
    this.parser = buildParser(this.ctx, options);
  }

  private parse(code: string, options?: CompileOptions) {
    // parse input to AST
    const res = profile(`parse`, options?.profile, () =>
      this.parser.reset().parseAll(code)
    );
    if (!res.accept) throw new Error("Parse error");

    // traverse AST to generate binaryen module
    profile(`traverse`, options?.profile, () => res.buffer[0].traverse());

    // optimize and validate
    if (options?.optimize ?? true)
      profile(`optimize`, options?.profile, () => this.ctx.mod.optimize());
    if (!profile(`validate`, options?.profile, () => this.ctx.mod.validate()))
      throw new Error("Module is invalid");
  }

  /**
   * Compile code to WebAssembly instance.
   */
  compile(code: string, options?: CompileOptions) {
    this.parse(code, options);

    const compiled = new WebAssembly.Module(this.ctx.mod.emitBinary());
    return new WebAssembly.Instance(compiled, options?.importObject);
  }

  /**
   * Compile code to WebAssembly text format.
   */
  emitText(code: string, options?: CompileOptions) {
    this.parse(code, options);
    return this.ctx.mod.emitText();
  }
}
