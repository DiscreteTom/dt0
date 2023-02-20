import * as fs from "fs";
import { parser } from "../../src";

console.log(parser.parseAll(fs.readFileSync("hello-world.dt0", "utf-8")));
