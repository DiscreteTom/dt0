import { build } from "../helper.js";

const wasm = build(import.meta.url) as {
  exports: {
    test: (a: number) => number;
  };
};

test("condition", () => {
  expect(wasm.exports.test(1)).toBe(0 + 1 + 2);
  expect(wasm.exports.test(0)).toBe(0 - 1 - 3);
});
