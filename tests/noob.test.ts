import { checkStatus } from "./exec-helper";

const code = `
fn main(): i32 {
  return 0;
}
`;

checkStatus("noob", code, 0);
