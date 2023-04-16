import { ELR } from "retsac";
import { lexer } from "../lexer/index.js";
import { Data, Context } from "./context.js";
import { applyResolvers } from "./resolvers.js";
import { applyAllRules } from "./rules/index.js";
import { CompileOptions, CompilerOptions } from "./model.js";

export class Compiler {
  private readonly parser: ELR.Parser<Data>;
  private readonly ctx: Context;

  constructor(options?: CompilerOptions) {
    this.ctx = new Context();
    this.parser = new ELR.AdvancedBuilder<Data>()
      .entry("fn_def")
      .use(applyAllRules(this.ctx))
      .use(applyResolvers)
      .build(lexer, {
        checkAll: options?.checkAll, // for dev
        debug: options?.debug, // for debug
        // generateResolvers: "builder", // for debug
      });
  }

  private parse(code: string, options?: CompileOptions) {
    const res = this.parser.reset().parseAll(code);

    if (!res.accept) throw new Error("Parse error");
    res.buffer[0].traverse();

    if (options?.optimize ?? true) this.ctx.mod.optimize();

    if (!this.ctx.mod.validate()) throw new Error("Module is invalid");
  }

  compile(code: string, options?: CompileOptions) {
    this.parse(code, options);

    const compiled = new WebAssembly.Module(this.ctx.mod.emitBinary());
    return new WebAssembly.Instance(compiled, {});
  }

  emitText(code: string, options?: CompileOptions) {
    this.parse(code, options);
    return this.ctx.mod.emitText();
  }
}
