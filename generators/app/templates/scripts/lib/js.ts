// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import * as rm from "rimraf";

export interface IJSTranspileOptions {
  scope?: string;
  configFile?: string;
}

export async function transpileJavascript(options: IJSTranspileOptions = {}) {
  console.log(
    chalk.bold.yellow(
      `- starting JS build process ${
        options.configFile ? "[ " + options.configFile + " ]" : ""
      }`
    )
  );

  console.log(
    chalk.dim(`- transpiling typescript ( `) +
      chalk.dim.grey(`./node_modules/.bin/tsc ${options.scope}`) +
      chalk.dim(` )`)
  );
  try {
    await asyncExec(
      `./node_modules/.bin/tsc ${options.configFile ? "-p " + options.configFile : ""} ${
        options.scope
      }`
    );
    console.log(chalk.green.bold(`- JS build completed successfully 👍`));
  } catch (e) {
    console.log(chalk.red.bold(`\n- Completed with code: ${e.code}  😡 `));
    console.log(chalk.red(`- Error was:\n`) + e.message + "\n");
    throw new Error("Problem with build step, see above");
  }

  return;
}

export async function clearTranspiledJS() {
  return new Promise(resolve => {
    rm("lib", () => {
      console.log(chalk.dim("- cleared LIB directory of all previous files"));
      resolve();
    });
  });
}

export async function lintSource() {
  return asyncExec(`tslint src/**/*`);
}
