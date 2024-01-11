import { newParserBuilder, entry } from "../src/parser/builder.js";
import { writeFileSync } from "fs";
import util from "node:util";
import prettier from "prettier";

// Usage: node --loader ts-node/esm scripts/serialize.ts
// use the following command when this issue is solved: https://github.com/TypeStrong/ts-node/issues/1997#issuecomment-1518740123
// Usage: // Usage: ts-node scripts/serialize.ts

const { serializable } = newParserBuilder().build({
  entry,
  checkAll: true,
  serialize: true,
});

const content = [
  `// generated by scripts/serialize.ts`,
  "",
  "// comment all lines and uncomment the next line to re-generate the data",
  "// export const serialized = undefined;",
  "",
  `import type { ELR } from "retsac";`,
  `import type { DT0ParserBuilder } from "./builder.js";`,
  "",
  `export const serialized = ${util.inspect(serializable, {
    maxArrayLength: Infinity,
    maxStringLength: Infinity,
    // depth should be infinity, set it to a limited number in case of circular references
    depth: 10,
  })} as unknown as ELR.ExtractSerializableParserData<DT0ParserBuilder>;`,
  `// when using AdvancedBuilder, generated NTs will break the format of serialized parser data`,
  `// so we have to cast it manually`,
].join("\n");

prettier.format(content, { parser: "typescript" }).then((content) => {
  writeFileSync("src/parser/serialized.ts", content, "utf-8");
});

// TODO: add test