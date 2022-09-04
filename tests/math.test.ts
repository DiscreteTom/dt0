import { checkStatus } from "./exec-helper";

const simple = `
fn main(): i32 {
  return 1 +1;
}
`;

checkStatus("math-simple", simple, 2);

const complex = `
fn main(): i32 {
  return 1 - (3 + -4) * 4 / 2;
}
`;

checkStatus("math-complex", complex, 3);
