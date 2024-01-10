import binaryen from "binaryen";

export type FuncInfo = {
  /**
   * `name => local index`. We need the local index to get/set local var in binaryen.
   */
  locals: Map<string, number>;
  /**
   * How many params this function has.
   */
  paramCount: number;
};

/**
 * We need this symbol table to keep track of the existence/index of variables, both global and local.
 */
export class SymbolTable {
  /**
   * For global var, we only need to keep track of the var's name, because we use name to find a global var in binaryen.
   */
  private readonly globals: Set<string>;
  private currentFunc?: FuncInfo;
  private readonly mod: binaryen.Module;

  constructor(mod: binaryen.Module) {
    this.globals = new Set();
    this.mod = mod;
    this.currentFunc = undefined;
  }

  /**
   * This will check if there's already a function scope.
   */
  enterFunc() {
    if (this.currentFunc !== undefined)
      throw new Error("Can't define function in function."); // TODO: don't throw error? record it in ASTNode?

    this.currentFunc = { locals: new Map(), paramCount: 0 };
    return this;
  }

  /**
   * This will check if there's already a function scope.
   */
  exitFunc() {
    if (this.currentFunc === undefined)
      throw new Error("No existing function scope to exit."); // TODO: don't throw error? record it in ASTNode?

    this.currentFunc = undefined;
    return this;
  }

  withinFunc(cb: () => void) {
    this.enterFunc();
    cb();
    this.exitFunc();
  }

  /**
   * Return the expression ref.
   */
  set(name: string, value: binaryen.ExpressionRef): binaryen.ExpressionRef {
    if (this.currentFunc !== undefined) {
      // current function exists, try to find in local first
      const index = this.currentFunc.locals.get(name);
      if (index !== undefined) {
        // found in local, just update the local var's value
        return this.mod.local.set(index, value);
      } else {
        // not found in local, try to find in global
        if (this.globals.has(name)) {
          // set global var
          return this.mod.global.set(name, value);
        }
        // not in global, create a new local var
        const index = this.currentFunc.locals.size;
        this.currentFunc.locals.set(name, index);
        return this.mod.local.set(index, value);
      }
    }

    // else, not in function, set in global
    this.globals.add(name);
    return this.mod.global.set(name, value);
  }

  /**
   * Create a new param var in current function. This must be called before any local var's declaration.
   * This will check if there's already a function scope.
   */
  setParam(name: string) {
    if (this.currentFunc === undefined)
      throw new Error("No existing function scope to set new param.");

    const index = this.currentFunc.locals.size;
    this.currentFunc.locals.set(name, index);
    this.currentFunc.paramCount++;

    if (this.currentFunc.locals.size !== this.currentFunc.paramCount)
      throw new Error("Param must be declared before local var.");

    return this;
  }

  /**
   * Create a new global var.
   * This will check if the name is duplicated.
   */
  setGlobal(name: string) {
    if (this.globals.has(name))
      throw new Error(`Duplicate global var name ${name}.`);
    this.globals.add(name);
    return this;
  }

  /**
   * Try to find var by name in the function scope then global scope.
   */
  get(
    name: string,
  ): { local: true; index: number } | { local: false; exist: boolean } {
    if (this.currentFunc !== undefined) {
      const res = this.currentFunc.locals.get(name);
      if (res !== undefined) return { local: true, index: res };
    }

    return { local: false, exist: this.globals.has(name) };
  }

  /** Return the param type array of the current function. */
  getParamTypes() {
    if (this.currentFunc === undefined)
      throw new Error("No existing function scope to get param types.");

    return Array(this.currentFunc.paramCount).fill(binaryen.i32) as number[];
  }

  /** Return the local var type array of the current function. */
  getLocalTypes() {
    if (this.currentFunc === undefined)
      throw new Error("No existing function scope to get local types.");

    return Array(
      this.currentFunc.locals.size - this.currentFunc.paramCount,
    ).fill(binaryen.i32) as number[];
  }
}
