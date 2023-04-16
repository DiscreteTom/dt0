import * as fs from "fs";
import { Compiler } from "../src/index.js";

/**
 * Usage: node cli.js xxx.dt0
 */

const srcPath = process.argv[2];
console.log(`Compiling ${srcPath}...`);
const compiler = new Compiler({ profile: true });
console.log(
  compiler.emitText(fs.readFileSync(srcPath, "utf-8"), { profile: true })
);
