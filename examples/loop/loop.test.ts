import * as fs from "fs";
import { Compiler } from "../../src";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

test("loop", () => {
  const compiler = new Compiler();
  const wasm = compiler.compile(
    fs.readFileSync(__filename.replace("test.ts", "dt0"), "utf-8")
  );
  expect((wasm.exports.test as (a: number) => number)(0)).toBe(0);
  expect((wasm.exports.test as (a: number) => number)(1)).toBe(0);
  expect((wasm.exports.test as (a: number) => number)(10)).toBe(0);
});
