import * as fs from "fs";
import { Compiler } from "../src/index.js";
import { fileURLToPath } from "url";
import { CompileOptions, CompilerOptions } from "../src/parser/model.js";

export function build(
  jsFileUrl: string,
  options?: { compiler?: CompilerOptions; compile?: CompileOptions }
) {
  const jsFilePath = fileURLToPath(jsFileUrl);
  const srcPath = jsFilePath.split(".")[0] + ".dt0";
  const compiler = new Compiler(options?.compiler);
  return compiler.compile(fs.readFileSync(srcPath, "utf-8"), options?.compile);
}
