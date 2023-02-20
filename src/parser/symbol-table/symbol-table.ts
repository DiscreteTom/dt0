export type SymbolInfo<T> = {
  type: T;
  /** The index in local scope. */
  index: number;
};

export class SymbolTable<T> {
  /** `(name => SymbolInfo)[]` */
  private readonly scopeStack: Map<string, SymbolInfo<T>>[];

  constructor() {
    this.scopeStack = [new Map()];
  }

  /** Create a new scope. */
  pushScope() {
    this.scopeStack.push(new Map());
    return this;
  }

  /** Remove the current scope. */
  popScope() {
    this.scopeStack.pop();
    return this;
  }

  /** Create a new local var in current scope. */
  set(name: string, type: T) {
    const scope = this.scopeStack.at(-1)!;
    scope.set(name, { type, index: scope.size });
  }

  /** Try to find var by name in all scopes. */
  get(name: string) {
    for (let i = this.scopeStack.length - 1; i >= 0; i--) {
      const scope = this.scopeStack[i];
      if (scope.has(name)) return scope.get(name);
    }
    return undefined;
  }
}
