import { ELR } from "retsac";
import { lexer } from "../lexer";
import { Data, mod } from "./context";
import { applyResolvers } from "./resolvers";
import { applyAllRules } from "./rules";
export { mod };

export const parser = new ELR.AdvancedBuilder<Data>()
  .entry("fn_def")
  .use(applyAllRules)
  .use(applyResolvers)
  .build(
    lexer,
    // comment this option when production to optimize performance
    {
      checkAll: true, // for dev
      // debug: true, // for debug
      // generateResolvers: "builder", // for debug
    }
  );
