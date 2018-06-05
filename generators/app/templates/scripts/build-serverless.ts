// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import * as moment from "moment";
import { exec, asyncExec, find, ls } from "async-shelljs";
import * as rm from "rimraf";
import * as fs from "fs";
// import * as process from "process";
import "../test/testing/test-console";
import { stdout, stderr } from "test-console";
import * as yaml from "js-yaml";
import {
  IStateMachine,
  IDictionary,
  IServerlessConfig,
  IServerlessFunction
} from "common-types";
import { serverless } from "./lib/serverless";
import { transpileJavascript, clearTranspiledJS } from "./lib/js";

function prepOutput(output: string) {
  return output
    .replace(/\t\r\n/, "")
    .replace("undefined", "")
    .trim();
}

(async () => {
  const scope: string[] = process.argv.slice(2).filter(s => s[0] !== "-");
  const options = new Set(
    process.argv
      .slice(2)
      .filter(s => s[0] === "-")
      .map(o => o.replace(/^-+/, ""))
  );

  try {
    await clearTranspiledJS();
    await transpileJavascript();
  } catch (e) {
    console.error(chalk.red("- Problem transpiling Javascript!"), e);
    process.exit(1);
  }
  try {
    console.log(chalk.yellow.bold("- Starting configuration of serverless.yml"));
    await serverless("plugins", `serverless ${chalk.bold("Plugins")}`);
    await serverless("functions", `serverless ${chalk.bold("Function(s)")}`, {
      required: true
    });
    await serverless("stepFunctions", `serverless ${chalk.bold("Step Function(s)")}`);
    await serverless("provider", `serverless ${chalk.bold("Provider")} definition`, {
      singular: true
    });
    // await serverless("package", `serverless ${chalk.bold("Package")} definition`, {
    //   singular: true
    // });
    console.log(chalk.green.bold("- serverless.yml file is fully configured 👍\n"));
  } catch (e) {
    console.log(chalk.red("- Problem with building serverless.yml file\n"), e + "\n");
    process.exit(1);
  }
  console.log("\n");
})();
