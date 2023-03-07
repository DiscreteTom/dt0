import * as fs from "fs";
import { parser, mod } from "../../src";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

test("condition", () => {
  const res = parser.parseAll(
    fs.readFileSync(__filename.replace("test.ts", "dt0"), "utf-8")
  );

  // console.log(res);
  if (!res.accept) throw new Error("Parse error");

  res.buffer[0].traverse();

  // mod.optimize();

  if (!mod.validate()) throw new Error("Module is invalid");

  // console.log(mod.emitText());
});
