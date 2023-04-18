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

  constructor() {
    this.globals = new Set();
    this.currentFunc = undefined;
  }

  enterFunc() {
    if (this.currentFunc !== undefined)
      throw new Error("Can't define function in function.");

    this.currentFunc = { locals: new Map(), paramCount: 0 };
    return this;
  }

  exitFunc() {
    if (this.currentFunc === undefined)
      throw new Error("No existing function scope to exit.");

    this.currentFunc = undefined;
    return this;
  }

  /**
   * Create a new local var in current function. This must be called after all param var's declaration.
   * Return the index of the new local var.
   */
  setLocal(name: string) {
    if (this.currentFunc == undefined)
      throw new Error("No existing function scope to set new local.");

    // TODO: check name duplication

    const index = this.currentFunc.locals.size;
    this.currentFunc.locals.set(name, index);
    return index;
  }

  /** Create a new param var in current function. This must be called before any local var's declaration. */
  setParam(name: string) {
    this.setLocal(name); // this will ensure currentFunc is not undefined
    this.currentFunc!.paramCount++;

    if (this.currentFunc!.locals.size != this.currentFunc!.paramCount)
      throw new Error("Param must be declared before local var.");

    return this;
  }

  /** Create a new global var. */
  setGlobal(name: string) {
    // TODO: check name duplication
    this.globals.add(name);
    return this;
  }

  /**
   * Try to find var by name in the function scope then global scope.
   * If not found, the returned index will be `undefined`.
   */
  get(
    name: string
  ): { local: true; index: number } | { local: false; exist: boolean } {
    if (this.currentFunc != undefined) {
      const res = this.currentFunc.locals.get(name);
      if (res != undefined) return { local: true, index: res };
    }

    return { local: false, exist: this.globals.has(name) };
  }

  /** Return the param type array of the current function. */
  getParamTypes() {
    if (this.currentFunc == undefined)
      throw new Error("No existing function scope to get param types.");

    return Array(this.currentFunc.paramCount).fill(binaryen.i32) as number[];
  }

  /** Return the local var type array of the current function. */
  getLocalTypes() {
    if (this.currentFunc == undefined)
      throw new Error("No existing function scope to get local types.");

    return Array(
      this.currentFunc.locals.size - this.currentFunc.paramCount
    ).fill(binaryen.i32) as number[];
  }
}
