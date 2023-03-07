import { ELR } from "retsac";
import { lexer } from "../lexer";
import { Data, mod, st } from "./context";
import { applyResolvers } from "./resolvers";
import { applyAll } from "./rules";
export { mod };

const advanced = new ELR.AdvancedBuilder<Data>();

applyAll(advanced);

const builder = advanced.expand().entry("fn_def");
applyResolvers(builder);

export const parser = builder.build(
  lexer,
  // comment this option when production to optimize performance
  {
    checkAll: true, // for dev
    // debug: true, // for debug
    // generateResolvers: "builder", // for debug
  }
);
