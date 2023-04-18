import binaryen from "binaryen";

export type SymbolInfo = {
  /** The index in local scope. */
  index: number;
  visible: boolean;
};

/** var name => symbol info */
export type Scope = Map<string, SymbolInfo>;

export class SymbolTable {
  private readonly globalScope: Scope;
  private funcScope?: Scope;
  /** Local scopes (loop/condition block). */
  private readonly outerScopeVarCount: number[];
  private funcParamCount: number;

  constructor() {
    this.globalScope = new Map();
    this.funcScope = undefined;
    this.outerScopeVarCount = [];
    this.funcParamCount = 0;
  }

  /** Create a new function scope. */
  enterFunc() {
    if (this.funcScope !== undefined)
      throw new Error("Can't define function in function.");

    this.funcScope = new Map();
    this.funcParamCount = 0;
    return this;
  }

  /** Clear the current function scope. */
  exitFunc() {
    if (this.funcScope === undefined)
      throw new Error("No existing function scope.");

    this.funcScope = undefined;
    this.funcParamCount = 0;
    return this;
  }

  /** Create a new local scope(e.g. loop/condition block). */
  pushScope() {
    if (this.funcScope == undefined)
      throw new Error("Can't create local scope in global scope.");

    this.outerScopeVarCount.push(this.funcScope.size);
    return this;
  }

  /** Exit a local scope, make vars in that local scope invisible. */
  popScope() {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    const count = this.outerScopeVarCount.pop();
    if (count == undefined) throw new Error("No local scope to pop.");

    this.funcScope.forEach((s) => {
      if (s.index > count) s.visible = false;
    });

    return this;
  }

  /** Create a new local var in current scope. */
  setLocal(name: string) {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    this.funcScope.set(name, {
      index: this.funcScope.size,
      visible: true,
    });

    return this;
  }

  /** Create a new param var in current function. This must be called before any local var's declaration. */
  setParam(name: string) {
    this.setLocal(name);
    this.funcParamCount++;

    if (this.funcScope!.size != this.funcParamCount)
      throw new Error("Param must be declared before local var.");

    return this;
  }

  /** Create a new global var. */
  setGlobal(name: string) {
    this.globalScope.set(name, {
      index: this.globalScope.size,
      visible: true,
    });

    return this;
  }

  /** Try to find var by name in the function scope then global scope. */
  get(name: string) {
    if (this.funcScope != undefined) {
      const res = this.funcScope.get(name);
      if (res != undefined && res.visible) return res;
    }

    return this.globalScope.get(name);
  }

  /** Return the param type array of the current function. */
  getParamTypes() {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    return [...this.funcScope.values()]
      .sort((a, b) => a.index - b.index)
      .filter((v) => v.index < this.funcParamCount)
      .map((v) => binaryen.i32);
  }

  /** Return the local var type array of the current function. */
  getLocalTypes() {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    return [...this.funcScope.values()]
      .sort((a, b) => a.index - b.index)
      .filter((v) => v.index >= this.funcParamCount)
      .map((v) => binaryen.i32);
  }
}
