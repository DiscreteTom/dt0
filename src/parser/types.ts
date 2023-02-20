import binaryen from "binaryen";

export enum TypeKind {
  Void,
  Bool,
  Int32,
}

export class Type {
  constructor(
    public readonly name: string,
    /** Type in dt0. */
    public readonly kind: TypeKind,
    /** The underlying binaryen type. */
    public readonly prototype: binaryen.Type
  ) {}

  static readonly Void = new Type("void", TypeKind.Void, binaryen.none);
  static readonly Bool = new Type("bool", TypeKind.Bool, binaryen.i32);
  static readonly Int32 = new Type("int32", TypeKind.Int32, binaryen.i32);
}
