import { build } from "../helper.js";

const wasm = build(import.meta.url, { compiler: { checkAll: true } }) as {
  exports: {
    test: (a: number) => number;
  };
};

test("hello-world", () => {
  expect(wasm.exports.test(123)).toBe(123 + 1);
});
