import * as fs from "fs";
import { Compiler } from "../src/index.js";
import { Command } from "commander";

// Usage: ts-node examples/cli.ts <xxx.dt0>

const program = new Command();

program
  .description("DT0 programming language compiler")
  .argument("<source.dt0>", "source file")
  .option("-o, --output <output.wasm>", "output file")
  .option("-t, --text", "emit text format instead of binary format")
  .option("-p, --profile", "profile compiler")
  .option("-d, --debug", "debug compiler")
  .option("-O, --optimize", "optimize module")
  .parse();

const options = program.opts<{
  output?: string;
  text?: boolean;
  profile?: boolean;
  debug?: boolean;
  optimize?: boolean;
}>();
const srcPath = program.args[0];

const compiler = new Compiler({
  profile: options.profile,
  debug: options.debug,
});

const compileOptions = {
  profile: options.profile,
  optimize: options.optimize,
};

const code = fs.readFileSync(srcPath, "utf-8");

if (options.text || !options.output || options.output.endsWith(".wat")) {
  const text = compiler.emitText(code, compileOptions);
  if (options.output) {
    fs.writeFileSync(options.output, text);
  } else {
    console.log(text);
  }
} else {
  const bin = compiler.emitBinary(code, compileOptions);
  fs.writeFileSync(options.output, bin);
}
