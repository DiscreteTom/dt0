import binaryen from "binaryen";

/** `var name => var index in the scope` */
export type Scope = Map<string, number>;

export type FuncInfo = {
  scope: Scope;
  paramCount: number;
};

export class SymbolTable {
  private readonly globalScope: Scope;
  private currentFunc?: FuncInfo;

  constructor() {
    this.globalScope = new Map();
    this.currentFunc = undefined;
  }

  enterFunc() {
    if (this.currentFunc !== undefined)
      throw new Error("Can't define function in function.");

    this.currentFunc = { scope: new Map(), paramCount: 0 };
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

    const index = this.currentFunc.scope.size;
    this.currentFunc.scope.set(name, index);
    return index;
  }

  /** Create a new param var in current function. This must be called before any local var's declaration. */
  setParam(name: string) {
    this.setLocal(name); // this will ensure currentFunc is not undefined
    this.currentFunc!.paramCount++;

    if (this.currentFunc!.scope.size != this.currentFunc!.paramCount)
      throw new Error("Param must be declared before local var.");

    return this;
  }

  /** Create a new global var. */
  setGlobal(name: string) {
    this.globalScope.set(name, this.globalScope.size);

    return this;
  }

  /**
   * Try to find var by name in the function scope then global scope.
   * If not found, the returned index will be `undefined`.
   */
  get(
    name: string
  ):
    | { local: true; index: number }
    | { local: false; index: number | undefined } {
    if (this.currentFunc != undefined) {
      const res = this.currentFunc.scope.get(name);
      if (res != undefined) return { local: true, index: res };
    }

    return { local: false, index: this.globalScope.get(name) };
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
      this.currentFunc.scope.size - this.currentFunc.paramCount
    ).fill(binaryen.i32) as number[];
  }
}
