// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec, asyncExec, find } from "async-shelljs";
import * as rm from "rimraf";
import * as process from "process";
import "../test/testing/test-console";
import { stdout } from "test-console";

function prepOutput(output: string) {
  return output.replace(/\t\r\n/, "").replace("undefined", "");
}

function getExecutionStage(): Promise<string> {
  return new Promise<string>(resolve => {
    const inspect = stdout.inspect();
    exec(`npm get stage`, (_code, output) => {
      inspect.restore();

      const result = prepOutput(output).trim();
      resolve(result ? result : "test");
    });
  });
}

/**
 * No transpiled JS files should be in TEST directories
 * as testing is using ts-node; remove these files as they
 * may represent unintentional stale tests
 */
function cleanJSTests() {
  rm.sync("test/**/*.js");
}

function scriptNames(scripts: string[]) {
  return scripts.map(script => {
    const path = script.split("/");
    const last = path.pop().replace("-spec.ts", "");
    return chalk.grey(path.join("/") + "/" + chalk.white(last));
  });
}

async function lintSource() {
  return asyncExec(`tslint src/**/*`);
}

async function mochaTests(stg: string, searchTerms: string[]) {
  process.env.AWS_STAGE = stg;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  await asyncExec(`mocha --exit --require ts-node/register ` + searchTerms.join(" "));
}

(async () => {
  const stage = await getExecutionStage();
  const searchTerms = process.argv.slice(2).filter(fn => fn[0] !== "-");
  const options = new Set(process.argv.slice(2).filter(fn => fn[0] === "-"));
  const availableScripts = await find("./test").filter(f => f.match(/-spec\.ts/));
  const scriptsToTest =
    searchTerms.length > 0
      ? availableScripts.filter(s => {
          return searchTerms.reduce((prv, script) => s.match(script) || prv, 0);
        })
      : availableScripts;

  if (options.has("-ls") || options.has("-l") || options.has("list")) {
    console.log(chalk.yellow("- 🤓  The following test scripts are available:"));
    console.log("    - " + scriptNames(availableScripts).join("\n    - "));

    return;
  }

  console.log(chalk.yellow("- Starting testing 🕐 "));

  try {
    await lintSource();
    console.log(chalk.green(`- Linting found no problems 👍`));
  } catch (e) {
    if (!options.has("--ignoreLint")) {
      console.log(
        chalk.red.bold(
          `- Error with linting! ${chalk.white.dim(
            "you can disable this by adding --ignoreLint flag\n"
          )} 😖`
        )
      );
    } else {
      console.log(
        `- Continuing onto mocha tests because of ${chalk.bold("--ignoreLint")} flag 🦄`
      );
    }
  }

  if (availableScripts.length === scriptsToTest.length) {
    console.log(
      chalk.yellow(
        `- Running ALL ${availableScripts.length} test scripts: ${chalk.grey(
          scriptNames(scriptsToTest).join(", ")
        )} 🏃`
      )
    );
  } else {
    console.log(
      chalk.yellow(
        `- Running ${chalk.bold(String(scriptsToTest.length))} of ${
          availableScripts.length
        } test scripts: [ ${chalk.grey(scriptNames(scriptsToTest).join(", "))} ] 🏃`
      )
    );
  }
  try {
    await mochaTests(stage, scriptsToTest);
    console.log(chalk.green("- Successful test run! 🚀\n"));
  } catch (e) {
    console.log(chalk.red.bold(`- Error(s) in tests. 😖\n  ${e}\n`));
  }
})();
