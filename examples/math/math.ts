import * as fs from "fs";
import { parser, mod } from "../../src/index.js";

const res = parser.parseAll(fs.readFileSync("math.dt0", "utf-8"));

if (!res.accept) throw new Error("Parse error");

res.buffer[0].traverse();

// mod.optimize();

if (!mod.validate()) throw new Error("Module is invalid");

console.log(mod.emitText());
