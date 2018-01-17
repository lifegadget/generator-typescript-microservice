// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec } from "shelljs";
import * as rm from "rimraf";
import * as process from "process";
import * as program from "commander";
import "../test/testing/test-console";
import { stdout, stderr } from "test-console";

function getScope(files?: string[]): string {
  let fileScope: string;

  if (!files || files[0] === "all") {
    console.log(
      chalk.white("no specific files specified so all files being tested")
    );
    fileScope = "--recursive test/**/*-spec.ts";
  } else {
    const shapeFileName = (fn: string) => {
      const prefix = fn.slice(0, 5) === "test/" ? "" : "test/";
      const postfix = fn.slice(-5) === "-spec" ? "" : "-spec";

      return prefix + fn + postfix + ".ts";
    };

    fileScope = files.map(f => shapeFileName(f)).join(" ");
  }

  return fileScope;
}

/**
 * No transpiled JS files should be in TEST directories
 * as testing is using ts-node; remove these files as they
 * may represent unintentional stale tests
 */
function cleanJSTests() {
  return new Promise((resolve, reject) => {
    rm("test/**/*.js", e => {
      if (e) {
        reject(e);
      } else {
        resolve();
      }
    });
  });
}

function executeTests(stg: string, fileScope: string): void {
  console.log(
    chalk.green(
      `${chalk.bold("mocha")} --compilers ts:ts-node/register  ${fileScope}`
    )
  );
  process.env.AWS_STAGE = stg;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  exec(`mocha --require ts-node/register ` + fileScope);
}

function lint() {
  console.log(chalk.yellow(`Linting source files`));
  return exec(`tslint ./src/**/*.ts`);
}

program
  .arguments("[files...]")
  .description("Run mocha tests with ts-node")
  .option(
    "-s, --stage [env]",
    "Environment to use",
    /^(dev|test|stage|prod)^/,
    "test"
  )
  .option("--skip-lint", "Skip the linting checks")
  .action(async files => {
    await cleanJSTests();
    const stage = program.stage;
    const scope = getScope(files);
    if (!program.skipLint) {
      await lint();
    }
    await executeTests(stage, scope);
  })
  .parse(process.argv);
