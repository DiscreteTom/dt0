export type CompilerBuildOptions = {
  /**
   * Enable this to print debug info.
   * @default false
   */
  debug?: boolean;
  /**
   *  Enable this to see if there is any error in the compiler.
   * @default false
   */
  checkAll?: boolean;
  /**
   * Enable this to print the time spent on parser building.
   * @default false
   */
  profile?: boolean;
};

export type CompileOptions = {
  /**
   * Enable this for release build.
   * @default true
   */
  optimize?: boolean;
  /**
   * Enable this to print the time spent on parsing.
   * @default false
   */
  profile?: boolean;
  /**
   * This will be passed to `WebAssembly.Instance`.
   * @default false
   */
  importObject?: WebAssembly.Imports;
};
