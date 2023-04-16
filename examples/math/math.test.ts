import { build } from "../helper.js";

const wasm = build(import.meta.url) as {
  exports: {
    test: (a: number) => number;
  };
};

test("math", () => {
  expect(wasm.exports.test(123)).toBe(123 + 1 + (Math.floor((2 * 3) / 4) % 5));
});
