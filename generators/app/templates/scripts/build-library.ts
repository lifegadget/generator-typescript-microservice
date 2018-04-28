// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec } from "shelljs";
import * as rm from "rimraf";
import * as process from "process";
import "../test/testing/test-console";
import { stdout, stderr } from "test-console";
import { transpileJavascript, clearTranspiledJS } from "./lib/js";

function prepOutput(output: string) {
  return output
    .replace(/\t\r\n/, "")
    .replace("undefined", "")
    .trim();
}

async function getScope(): Promise<string> {
  let scope: string;

  return new Promise<string>(resolve => {
    const inspect = stdout.inspect();
    exec(`npm get files`, (code, output) => {
      inspect.restore();
      const result = prepOutput(output);

      if (!result) {
        console.log(
          chalk.grey(
            'no files specified with "--files=*" option so all files under src directory will be built\n'
          )
        );
        scope = "";
      } else {
        scope = result;
      }

      resolve(scope);
    });
  });
}

(async () => {
  const scope: string = await getScope();
  await clearTranspiledJS();
  await transpileJavascript({scope});
  await transpileJavascript({scope, configFile: 'tsconfig-esm.json'});
})();
