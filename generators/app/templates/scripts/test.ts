// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec } from "shelljs";
import * as rm from "rimraf";
import * as process from "process";
import "../test/testing/test-console";
import { stdout, stderr } from "test-console";
import * as glob from "glob";
import { log } from "util";

function prepOutput(output: string) {
  return output.replace(/\t\r\n/, "").replace("undefined", "");
}

async function getExecutionStage(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const inspect = stdout.inspect();
    exec(`npm get stage`, (code, output) => {
      inspect.restore();

      const result = prepOutput(output).trim();
      resolve(result ? result : "test");
    });
  });
}

async function getScope(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    let fileScope: string;

    exec(`npm get files`, (code, out) => {
      if (!out || out === "undefined\n") {
        console.log(
          chalk.white(
            'no files specified with "--files=file.ts" option so all files being tested'
          )
        );
        fileScope = "--recursive test/**/*-spec.ts";
        communicateScope(fileScope);
        resolve(fileScope);
      } else {
        const prefix = out.slice(0, 5) === "./test/" ? "" : "test/**/";
        const postfix = out.slice(-5) === "-spec" ? "" : "-spec";
        const regex = out.split(".")[0].replace(/[\n\t\r]/, "");
        fileScope = prefix + regex + postfix + ".ts";

        communicateScope(fileScope);
        resolve(fileScope);
      }
    });
  });
}

function communicateScope(fileScope: string) {
  console.log(
    chalk.green(
      `${chalk.bold("mocha")} --compilers ts:ts-node/register  ${fileScope}`
    )
  );
}

/**
 * No transpiled JS files should be in TEST directories
 * as testing is using ts-node; remove these files as they
 * may represent unintentional stale tests
 */
function cleanJSTests() {
  rm.sync("test/**/*.js");
}

function executeTests(stg: string, fileScope: string): void {
  process.env.AWS_STAGE = stg;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  exec(
    `mocha --compilers ts:ts-node/register ` +
      `--compilerOptions --require ts-node/register ` +
      fileScope
  );
}

let stage: string;
let scope: string;

(async () => {
  const stage: string = await getExecutionStage();
  const scope: string = await getScope();
  executeTests(stage, scope);
})();
