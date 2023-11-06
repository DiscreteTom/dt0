import * as fs from "fs";
import { Compiler } from "../src/index.js";

// Usage: ts-node examples/cli.ts <xxx.dt0>

// TODO: more command line options, e.g. --debug, --profile, --optimize, etc.

const srcPath = process.argv[2];
console.log(`Compiling ${srcPath} ...`);

const compiler = new Compiler({
  profile: true,
  // debug: true
});

console.log(
  compiler.emitText(fs.readFileSync(srcPath, "utf-8"), {
    profile: true,
    // optimize: false,
  })
);
