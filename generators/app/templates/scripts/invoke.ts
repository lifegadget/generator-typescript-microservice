// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec, asyncExec, ls } from "async-shelljs";
import * as rm from "rimraf";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as inquirer from "inquirer";

async function build(fns?: string[]) {
  return asyncExec(`ts-node scripts/build.ts --color=true ${fns}`);
}

async function deploy(stage: string, fns: string[] = []) {
  const msg = fns.length !== 0 ? `` : ``;
  try {
    if (fns.length === 0) {
      console.log(chalk.yellow(`- starting full serverless deployment`));
      await asyncExec(`sls deploy --aws-s3-accelerate`);
      console.log(chalk.green.bold(`- successful serverless deployment 🚀`));
    } else {
      console.log(
        chalk.yellow(
          `- deployment of ${fns.length} serverless function(s): ${fns.join(", ")}`
        )
      );
      await asyncExec(
        `sls deploy function --force --aws-s3-accelerate --function ${fns.join(" ")}`
      );
      console.log(chalk.green.bold(`- 🚀  successful serverless deployment `));
    }
  } catch (e) {
    console.log(chalk.red.bold(`- 💩  problem deploying!`));
  }
}

export function invoke(fn, data) {
  const dataSource = {};
  try {
    console.log(chalk.yellow(`- invoking ${chalk.bold(fn)}`));
    console.log(chalk.grey(`- using ${chalk.bold(data)} data source`));
    const response = asyncExec(`sls invoke local --function ${fn} --data '${data}'`);
    console.log(chalk.green("- Function invoked successfully 🚀"));
  } catch (e) {
    console.log(chalk.red(`- Invocation of the serverless function failed 😠`, e));
  }
}

export async function chooseFunctions() {
  let config;
  try {
    config = yaml.safeLoad(fs.readFileSync("serverless.yml", { encoding: "utf-8" }));
  } catch (e) {
    console.log(
      chalk.red(`Problem loading your serverless.yml file to find functions!`, e)
    );
    throw new Error(`can't load serverless.yml`);
  }

  const functions = Object.keys(config.functions);
  if (functions.length === 0) {
    console.log(
      chalk.red("- You do not have any functions defined in your serverless.yml file!")
    );
    throw new Error("no functions in serverless.yml");
  }
  const chosenFunction = await inquirer.prompt([
    {
      name: "which",
      type: "list",
      choices: functions,
      message: "Choose a function from list below"
    }
  ]);

  return chosenFunction.which;
}

export async function lookupDataSource(name: string) {
  const sources = await ls("test/data/*.json")
    .concat("default")
    .filter(n => n.match(name));
  if (sources.length === 0) {
    console.log(chalk.red(`- "${name}" is an unknown data source`));
    throw new Error("unknown-data-source");
  }
  if (sources.length > 1) {
    console.log(
      chalk.magenta("- your data source is ambiguous and matches more than one source")
    );
    console.log(chalk.grey("- matches include", sources.join(", ")));
    throw new Error("ambiguous-data-source");
  }

  return sources[0];
}

export function getDataSource(name: string) {
  return name === "default" ? "{}" : fs.readFileSync(name, { encoding: "utf-8" });
}

export async function chooseDataSource() {
  console.log(
    chalk.white(`-Since you haven't stated a data source, please choose one from below.`)
  );
  console.log(
    chalk.grey(`-Note: you can add JSON files to "test/data" and it will be on this list`)
  );

  const dataSources = await ls("test/data/*.json").concat("default");

  const chosenData = await inquirer.prompt([
    {
      name: "source",
      type: "list",
      choices: dataSources,
      default: "default",
      message: "Choose a data source from list below"
    }
  ]);

  return chosenData.source;
}

export function findDataSource(source: string) {
  //
}

(async () => {
  let [fn, dataSource] = process.argv.slice(2);
  if (!fn) {
    fn = await chooseFunctions();
  }

  dataSource = !dataSource
    ? await getDataSource(await chooseDataSource())
    : await getDataSource(await lookupDataSource(dataSource));

  await build();
  await invoke(fn, dataSource);
})();
