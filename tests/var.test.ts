import { checkStatus } from "./exec-helper";

const code_simple = `
fn main(): i32 {
  let a = 1;
  return a;
}
`;

checkStatus("var-simple", code_simple, 1);

const code_complex = `
fn main(): i32 {
  let a = 1;
  let b = a + 1;
  return b - -a;
}
`;

checkStatus("var-complex", code_complex, 3);
