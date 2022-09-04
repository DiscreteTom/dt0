import llvm from "llvm-bindings";

const types: { [name: string]: (builder: llvm.IRBuilder) => llvm.Type } = {
  void: (builder) => builder.getVoidTy(),
  bool: (builder) => builder.getInt1Ty(),
  byte: (builder) => builder.getInt8Ty(),
  i16: (builder) => builder.getInt16Ty(),
  i32: (builder) => builder.getInt32Ty(),
  i64: (builder) => builder.getInt64Ty(),
  f32: (builder) => builder.getFloatTy(),
  f64: (builder) => builder.getDoubleTy(),
};

export default types;
