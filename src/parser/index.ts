import { ELR } from "retsac";
import { lexer } from "../lexer/index.js";
import { Data, Context } from "./context/index.js";
import { applyResolvers } from "./resolvers.js";
import { applyAllRules } from "./rules/index.js";
import { CompileOptions, CompilerOptions } from "./model.js";

export class Compiler {
  private readonly parser: ELR.Parser<Data>;
  private readonly ctx: Context;

  constructor(options?: CompilerOptions) {
    this.ctx = new Context();
    if (options?.profile) console.time(`build parser`);
    this.parser = new ELR.AdvancedBuilder<Data>()
      .entry("fn_def")
      .use(applyAllRules(this.ctx))
      .use(applyResolvers)
      .build(lexer, {
        checkAll: options?.checkAll, // for dev
        debug: options?.debug, // for debug
        // generateResolvers: "builder", // for debug
      });
    if (options?.profile) console.timeEnd(`build parser`);
  }

  private parse(code: string, options?: CompileOptions) {
    if (options?.profile) console.time(`parse`);
    const res = this.parser.reset().parseAll(code);
    if (options?.profile) console.timeEnd(`parse`);
    if (!res.accept) throw new Error("Parse error");

    if (options?.profile) console.time(`traverse`);
    res.buffer[0].traverse();
    if (options?.profile) console.timeEnd(`traverse`);

    if (options?.optimize ?? true) {
      if (options?.profile) console.time(`optimize`);
      this.ctx.mod.optimize();
      if (options?.profile) console.timeEnd(`optimize`);
    }

    if (options?.profile) console.time(`validate`);
    const valid = this.ctx.mod.validate();
    if (options?.profile) console.timeEnd(`validate`);
    if (!valid) throw new Error("Module is invalid");
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
