import { ELR } from "retsac";
import { lexer } from "../lexer/index.js";
import { Data, Context } from "./context/index.js";
import { applyResolvers } from "./resolvers.js";
import { applyAllRules } from "./rules/index.js";
import { CompileOptions, CompilerOptions } from "./model.js";

function profile<T>(name: string, enabled: boolean | undefined, cb: () => T) {
  if (!enabled) return cb();
  console.time(name);
  const res = cb();
  console.timeEnd(name);
  return res;
}

export class Compiler {
  private readonly parser: ELR.Parser<Data>;
  private readonly ctx: Context;

  constructor(options?: CompilerOptions) {
    this.ctx = new Context();

    // build parser
    this.parser = profile(`build parser`, options?.profile, () =>
      new ELR.AdvancedBuilder<Data>()
        .entry("fn_defs")
        .define(
          { fn_defs: `fn_def+` },
          ELR.traverser<Data>(({ $ }) => {
            $(`fn_def`).map((s) => s.traverse()!);
          })
        )
        .use(applyAllRules(this.ctx))
        .use(applyResolvers)
        .build(lexer, {
          checkAll: options?.checkAll, // for dev
          debug: options?.debug, // for debug
          // generateResolvers: "builder", // for debug
        })
    );
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
