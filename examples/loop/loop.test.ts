import { build } from "../helper.js";

const wasm = build(import.meta.url) as {
  exports: {
    test: (a: number) => number;
  };
};

test("loop", () => {
  expect(wasm.exports.test(0)).toBe(0);
  expect(wasm.exports.test(1)).toBe(0);
  expect(wasm.exports.test(10)).toBe(0);
});
