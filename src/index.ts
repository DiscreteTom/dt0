import { parse } from "./manager";
import * as fs from "fs";

console.log(parse(fs.readFileSync(process.argv[2], "utf-8"), "test"));
