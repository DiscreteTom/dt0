import { parse } from "../src/manager";
import { writeFileSync } from "fs";
import { spawnSync } from "child_process";

const moduleID = "test";
const tmp_folder = "tmp";

export function run(tmp_file_name: string, code: string) {
  const ll_file = `${tmp_folder}/${tmp_file_name}.ll`;
  const obj_file = `${tmp_folder}/${tmp_file_name}.o`;
  const exe_file = `${tmp_folder}/${tmp_file_name}`;

  writeFileSync(ll_file, parse(code, moduleID), "utf-8");

  return spawnSync(
    `llc-14 -filetype=obj ${ll_file} -o ${obj_file} && clang-14 ${obj_file} -o ${exe_file} && ${exe_file}`,
    { shell: true }
  );
}

export function checkStatus(name: string, code: string, expected: number) {
  test(name, () => {
    expect(run(name, code).status).toBe(expected);
  });
}
