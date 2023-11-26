import { build } from "../helper.js";

const wasm = build(import.meta.url) as {
  exports: {
    test: () => number;
  };
};

test("math", () => {
  expect(wasm.exports.test()).toBe(1 + (Math.floor((2 * 3) / 4) % 5));
});
