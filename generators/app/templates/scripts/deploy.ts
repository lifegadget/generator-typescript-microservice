// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec, exit } from "async-shelljs";
import { IServerlessConfig } from "common-types";
import * as yaml from "js-yaml";
import * as fs from "fs";
import { parseArgv } from "./lib/util";

let _serverlessConfig: IServerlessConfig = null;
function serverlessConfig(): IServerlessConfig {
  if (!_serverlessConfig) {
    _serverlessConfig = yaml.safeLoad(
      fs.readFileSync("./serverless.yml", {
        encoding: "utf-8"
      })
    ) as IServerlessConfig;
  }

  return _serverlessConfig;
}

function findFunctions(input: string[]): string[] {
  const fns: string[] = [];
  const functions = new Set(Object.keys(serverlessConfig().functions));
  input.map(i => {
    if (functions.has(i)) {
      fns.push(i);
    }
  });
  return fns;
}

function findSteps(input: string[]): string[] {
  const steps: string[] = [];
  const stepFunctions = new Set(
    Object.keys(
      serverlessConfig().stepFunctions
        ? serverlessConfig().stepFunctions.stateMachines
        : []
    )
  );

  input.map(i => {
    if (stepFunctions.has(i)) {
      steps.push(i);
    }
  });
  return steps;
}

async function build(fns?: string[]) {
  try {
    await asyncExec(`ts-node scripts/build.ts --color=true ${fns}}`);
  } catch (e) {
    console.error(chalk.red("- 🤯 build failed, deployment stopped"));
    process.exit();
  }
  console.log(chalk.green("- Build step completed successfully 🚀"));

  return;
}

async function deploy(stage: string, fns: string[] = []) {
  const msg = fns.length !== 0 ? `` : ``;

  try {
    if (fns.length === 0) {
      console.log(
        chalk.yellow(`- starting full serverless deployment to ${chalk.bold(stage)}`)
      );
      console.log(
        chalk.grey(`- sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`)
      );
      await asyncExec(`sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`);
      console.log(chalk.green.bold(`- successful serverless deployment 🚀`));
    } else {
      const functions: string[] = findFunctions(fns);
      const steps: string[] = findSteps(fns);

      if (functions.length > 0) {
        console.log(
          chalk.yellow(
            `- deployment of ${functions.length} serverless function(s) to ${chalk.bold(
              stage
            )}: ${functions.join(", ")}`
          )
        );
        const promises: any[] = [];
        functions.map(fn => {
          promises.push(
            asyncExec(
              `sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`
            )
          );
        });
        await Promise.all(promises);
      }
      if (steps.length > 0) {
        console.log(
          chalk.yellow(
            `- deployment of ${steps.length} serverless function(s): ${steps.join(
              ", "
            )} to ${chalk.bold(stage)} environment.`
          )
        );
        await asyncExec(`sls deploy --name ${fns.join(" --function ")} --stage ${stage}`);
      }
      console.log(chalk.green.bold(`- 🚀  successful serverless deployment `));
    }
  } catch (e) {
    console.log(chalk.red.bold(`- 💩  problem deploying!`));
  }
}

function getFunctionIfScoped(): string | undefined {
  return undefined;
}

// MAIN

(async () => {
  const { params, options } = parseArgv()("--help", "--profile", "--key");
  const sls = await serverlessConfig();

  const stage = options.prod ? "prod" : sls.provider.stage || "dev";
  if (!options.skip) {
    try {
      await build(params);
    } catch (e) {
      console.error(`failed to execute build`);

      throw e;
    }
  }
  await deploy(stage, params);
})();
