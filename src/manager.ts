import { Manager } from "retsac";
import { lexer } from "./lexer";
import { getParser } from "./parser";
import llvm from "llvm-bindings";

export function parse(code: string, moduleID: string) {
  const context = new llvm.LLVMContext();
  const module = new llvm.Module(moduleID, context);
  const builder = new llvm.IRBuilder(context);

  let manager = new Manager({
    lexer,
    parser: getParser({ module, context, builder }),
  });

  const res = manager.parseAll(code);

  if (res.accept) {
    if (llvm.verifyModule(module)) {
      throw new Error("Verifying module failed");
    }
    return module.print();
  } else {
    throw new Error(`Parse failed.`);
  }
}
