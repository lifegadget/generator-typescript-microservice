// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec, asyncExec, find } from "async-shelljs";
import * as rm from "rimraf";
import * as process from "process";
import "../test/testing/test-console";
import { stdout, stderr } from "test-console";
import { transpileJavascript, clearTranspiledJS, lintSource } from "./lib/js";

function prepOutput(output: string) {
  return output.replace(/\t\r\n/, "").replace("undefined", "");
}

function scriptNames(scripts: string[], splitter = ", ") {
  return scripts.map(script => {
    const path = script.split("/");
    const last = path.pop().replace("-spec.ts", "");
    return chalk.grey(path.join("/") + "/" + chalk.white(last));
  });
}

async function findScripts(terms: string[]) {
  const scripts = [];
  if (terms.length === 0) {
    return [];
  }
  return find(terms).filter(file => file.match(/\-spec\.ts/));
}

async function mochaTests(stg: string, searchTerms: string[]) {
  const scripts = await findScripts(searchTerms);
  process.env.AWS_STAGE = stg;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  await asyncExec(`mocha --require ts-node/register ` + scripts.join(" "));
}

(async () => {
  const searchTerms = process.argv.slice(2).filter(fn => fn[0] !== "-");
  const options = new Set(
    process.argv
      .slice(2)
      .filter(fn => fn[0] === "-")
      .map(o => o.replace(/^-/, ""))
  );
  const stage = options.has("dev") ? "dev" : "test";
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

  console.log(
    chalk.yellow(
      `- 🕐  Starting testing ${stage !== "test" ? "[ stage:  " + stage + " ]" : ""}`
    )
  );

  try {
    await lintSource();
    console.log(chalk.green(`- 👍  Linting found no problems  `));
  } catch (e) {
    if (!options.has("--ignoreLint")) {
      console.log(
        chalk.red.bold(
          `- 😖 Error with linting! ${chalk.white.dim(
            "you can disable this by adding --ignoreLint flag\n"
          )}`
        )
      );
      process.exit(1);
    } else {
      console.log(
        `- 🦄  continuing onto mocha tests because of ${chalk.bold("--ignoreLint")} flag`
      );
    }
  }

  if (availableScripts.length === scriptsToTest.length) {
    console.log(
      chalk.yellow(
        `- 🏃  Running ALL ${availableScripts.length} test scripts: ${chalk.grey(
          scriptNames(scriptsToTest).join(", ")
        )}`
      )
    );
  } else {
    console.log(
      chalk.yellow(
        `- 🏃  Running ${chalk.bold(String(scriptsToTest.length))} of ${
          availableScripts.length
        } test scripts: ${chalk.grey(scriptNames(scriptsToTest).join(", "))}`
      )
    );
  }
  try {
    await mochaTests(stage, scriptsToTest);
    console.log(chalk.green("- 🚀  Successful test run!\n"));
  } catch (e) {
    console.log(chalk.red.bold(`- 😖 Error(s) in tests.\n`));
    process.exit(1);
  }
})();
