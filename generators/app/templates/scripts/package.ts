// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec, rm } from "async-shelljs";

// https://serverless.com/framework/docs/providers/aws/cli-reference/package/

function clearOldPackageContents(dir: string) {
  //
}

(async () => {
  const args = process.argv.slice(2).filter(fn => fn[0] !== "-");
  const options = new Set(process.argv.slice(2).filter(fn => fn[0] === "-"));
  const stage = options["--prod"] ? "prod" : "dev";
  const region = "us-east-1";
  const outputDir = "./serverless-package";

  console.log(chalk.yellow.bold("- 🕐  Starting packaging serverless assets"));
  try {
    await asyncExec(
      `ts-node scripts/build.ts --color=true ${
        options.has("-ignoreLint") ? "--ignoreLint" : ""
      }`
    );
  } catch (e) {
    console.log(chalk.red(`- 😖  Failed to build so no attempt to deploy [${e.code}]`));
    return;
  }

  console.log(chalk.yellow(`- 🗯  Clearing the package directory [${outputDir}]`));
  rm("-rf", outputDir);
  console.log(chalk.green(`- 👍  Package directory cleared`));

  console.log(
    chalk.yellow(
      `- 🗃  Starting packaging process with serverless into "${outputDir}" directory`
    )
  );
  try {
    await asyncExec(`sls package --stage ${stage} --region ${region}`);
    console.log(chalk.green(`- 🚀  Successful packaging`));
    await asyncExec(`open ${outputDir}`);
  } catch (e) {
    console.log(chalk.red(`- 😖  Problems in deployment!\n`));
    return;
  }
})();
