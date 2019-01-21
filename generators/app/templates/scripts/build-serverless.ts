// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import "../test/testing/test-console";
import { buildServerlessConfig } from "./lib/serverless";
import { transpileJavascript, clearTranspiledJS } from "./lib/js";

(async () => {
  try {
    await clearTranspiledJS();
    await transpileJavascript();
  } catch (e) {
    console.error(chalk.red("- Problem transpiling Javascript!"), e);
    process.exit(1);
  }
  try {
    console.log(chalk.yellow.bold("- Starting configuration of serverless.yml"));
    await buildServerlessConfig();

    console.log(chalk.green.bold("- serverless.yml file is fully configured 👍\n"));
  } catch (e) {
    console.log(chalk.red("- Problem with building serverless.yml file\n"), e + "\n");
    process.exit(1);
  }
  console.log("\n");
})();
