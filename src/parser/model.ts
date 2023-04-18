export type CompilerOptions = {
  /** Enable this to print debug info. */
  debug?: boolean;
  /** Enable this to see if there is any error in the compiler. */
  checkAll?: boolean;
  /**
   * Enable this to print the time spent on parser building.
   */
  profile?: boolean;
};

export type CompileOptions = {
  /**
   * Enable this for release build. Default: `true`.
   */
  optimize?: boolean;
  /**
   * Enable this to print the time spent on parsing.
   */
  profile?: boolean;
};
