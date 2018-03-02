// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec, asyncExec } from "async-shelljs";
import * as rm from "rimraf";

async function build(fns?: string[]) {
  return asyncExec(`ts-node scripts/build.ts --color=true ${fns}`);
}

async function deploy(stage: string, fns: string[] = []) {
  const msg = fns.length !== 0 ? `` : ``;
  try {
    if (fns.length === 0) {
      console.log(chalk.yellow(`- starting full serverless deployment to ${chalk.bold(stage)}`));
      await asyncExec(`sls deploy --aws-s3-accelerate --stage ${stage}`);
      console.log(chalk.green.bold(`- successful serverless deployment 🚀`));
    } else {
      console.log(
        chalk.yellow(`- deployment of ${fns.length} serverless function(s): ${fns.join(", ")}`)
      );
      await asyncExec(
        `sls deploy function --force --aws-s3-accelerate --function ${fns.join(
          " "
        )} --stage ${stage}`
      );
      console.log(chalk.green.bold(`- 🚀  successful serverless deployment `));
    }
  } catch (e) {
    console.log(chalk.red.bold(`- 💩  problem deploying!`));
  }
}

function getFunctionIfScoped(): string | undefined {
  return undefined;
}

function getStage() {
  return "dev";
}

(async () => {
  const fns = process.argv.slice(2).filter(fn => fn[0] !== "-");
  const options = new Set(
    process.argv
      .slice(2)
      .filter(fn => fn[0] === "-")
      .map(p => p.replace(/^-+/g, ""))
  );

  const stage = options.has("prod") ? "prod" : "dev";
  if (!options.has("skip")) {
    await build(fns);
  }
  await deploy(stage, fns);
})();
