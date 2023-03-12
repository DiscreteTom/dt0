import * as fs from "fs";
import { Compiler } from "../../src";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

test("hello-world", () => {
  const compiler = new Compiler();
  const wasm = compiler.compile(
    fs.readFileSync(__filename.replace("test.ts", "dt0"), "utf-8")
  );
  expect((wasm.exports.test as (a: number) => number)(123)).toBe(123 + 1);
});
