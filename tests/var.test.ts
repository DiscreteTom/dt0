import { checkStatus } from "./exec-helper";

const simple = `
fn main(): i32 {
  let a = 1;
  return a;
}
`;

checkStatus("var-simple", simple, 1);

const complex = `
fn main(): i32 {
  let a = 1;
  let b = a + 1;
  return b - -a;
}
`;

checkStatus("var-complex", complex, 3);
