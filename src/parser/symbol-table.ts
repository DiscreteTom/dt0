export type SymbolInfo<T> = {
  type: T;
  /** The index in local scope. */
  index: number;
  visible: boolean;
};

/** var name => symbol info */
export type Scope<T> = Map<string, SymbolInfo<T>>;

export class SymbolTable<T> {
  private readonly globalScope: Scope<T>;
  private funcScope?: Scope<T>;
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
  set(name: string, type: T) {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    this.funcScope.set(name, {
      type,
      index: this.funcScope.size,
      visible: true,
    });

    return this;
  }

  setFuncParam(name: string, type: T) {
    this.set(name, type);
    this.funcParamCount++;

    return this;
  }

  /** Create a new global var. */
  setGlobal(name: string, type: T) {
    this.globalScope.set(name, {
      type,
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

  getFuncParamTypes() {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    return [...this.funcScope.values()]
      .sort((a, b) => a.index - b.index)
      .filter((v) => v.index < this.funcParamCount)
      .map((v) => v.type);
  }

  getFuncLocalTypes() {
    if (this.funcScope == undefined)
      throw new Error("No existing function scope.");

    return [...this.funcScope.values()]
      .sort((a, b) => a.index - b.index)
      .filter((v) => v.index >= this.funcParamCount)
      .map((v) => v.type);
  }
}
