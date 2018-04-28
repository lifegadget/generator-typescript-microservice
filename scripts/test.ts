// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec } from "async-shelljs";
import * as process from "process";
import * as program from "commander";

function getScope(files: string): string {
  let fileScope: string;

  if (!files || files === "all") {
    console.log(
      chalk.white(
        "no specific files specified so all files being tested, use -h for more help"
      )
    );
    fileScope = "--recursive test/**/*-spec.ts";
  } else {
    const prefix = files.slice(0, 5) === "test/" ? "" : "test/";
    const postfix = files.slice(-5) === "-spec" ? "" : "-spec";

    fileScope = prefix + files + postfix + ".ts";
  }

  console.log(
    chalk.green(`${chalk.bold("mocha")} --require ts:ts-node/register  ${fileScope}`)
  );

  return fileScope;
}

async function executeTests(stg: string, fileScope: string) {
  process.env.AWS_STAGE = stg;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  await exec(`mocha --exit --require ts-node/register ` + fileScope);
}

if (process.argv.length === 2) {
  console.log(`No tests specified, running ${chalk.bold("all")} tests.`);
  process.argv.push("all");
}

program
  .arguments("[files]")
  .option("-s, --stage [env]", "Environment to use", /^(dev|test|stage|prod)^/, "test")
  .option(
    "-f, --files",
    "an alternative syntax to just specifying files as first argument on command line"
  )
  .action(async files => {
    console.log(files, program.stage);
    const stage = program.stage;
    const scope = getScope(files);
    console.log("scope:", scope);

    await executeTests(stage, scope);
    console.log("tests complete");
  })
  .parse(process.argv);
