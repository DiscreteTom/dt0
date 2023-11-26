import { build } from "../helper.js";

const wasm = build(import.meta.url) as {
  exports: {
    test: (a: number, b: number, condition: number) => number;
  };
};

test("condition", () => {
  const a = 5;
  const b = 10;

  // 0 for false, 1 for true
  expect(wasm.exports.test(a, b, 1)).toBe(a + b);
  expect(wasm.exports.test(a, b, 0)).toBe(a - b);
});
