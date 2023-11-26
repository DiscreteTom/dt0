import { build } from "../helper.js";

const wasm = build(import.meta.url) as {
  exports: {
    test1: (a: number, b: number) => number;
    test2: (a: number, b: number) => number;
  };
};

test("loop", () => {
  expect(wasm.exports.test1(1, 0)).toBe(1);
  expect(wasm.exports.test1(2, 0)).toBe(2);
  expect(wasm.exports.test2(0, 0)).toBe(0);
  expect(wasm.exports.test2(2, 0)).toBe(2);
});
