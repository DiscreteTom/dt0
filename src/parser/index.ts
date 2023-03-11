import { ELR } from "retsac";
import { lexer } from "../lexer";
import { Data, Context } from "./context";
import { applyResolvers } from "./resolvers";
import { applyAllRules } from "./rules";

export class Compiler {
  private readonly parser: ELR.Parser<Data>;
  private readonly ctx: Context;

  constructor() {
    this.ctx = new Context();
    this.parser = new ELR.AdvancedBuilder<Data>()
      .entry("fn_def")
      .use(applyAllRules(this.ctx))
      .use(applyResolvers)
      .build(
        lexer,
        // comment this option when production to optimize performance
        {
          checkAll: true, // for dev
          // debug: true, // for debug
          // generateResolvers: "builder", // for debug
        }
      );
  }

  compile(code: string, options?: { optimize?: boolean }) {
    const res = this.parser.reset().parseAll(code);

    if (!res.accept) throw new Error("Parse error");
    res.buffer[0].traverse();

    if (options?.optimize) this.ctx.mod.optimize();

    if (!this.ctx.mod.validate()) throw new Error("Module is invalid");

    // console.log(mod.emitText());

    const compiled = new WebAssembly.Module(this.ctx.mod.emitBinary());
    return new WebAssembly.Instance(compiled, {});
  }
}
