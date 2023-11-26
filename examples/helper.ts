import * as fs from "fs";
import { Compiler } from "../src/index.js";
import { fileURLToPath } from "url";
import type { CompileOptions, CompilerBuildOptions } from "../src/model.js";

export function build(
  jsFileUrl: string,
  options?: { compiler?: CompilerBuildOptions; compile?: CompileOptions },
) {
  const jsFilePath = fileURLToPath(jsFileUrl);
  const srcPath = jsFilePath.split(".")[0] + ".dt0";
  const compiler = new Compiler(options?.compiler);
  return compiler.compile(fs.readFileSync(srcPath, "utf-8"), options?.compile);
}
