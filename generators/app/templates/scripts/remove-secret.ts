// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import * as yaml from "js-yaml";
import { parseArgv } from "./lib/util";
import { IServerlessConfig } from "common-types";
import { readFileSync } from "fs";

const commandLine: string[] = process.argv.slice(2);
const { params, options } = parseArgv("--overwrite", "-o")(
  "--type",
  "--region",
  "--profile"
);
const config: IServerlessConfig = yaml.safeLoad(
  readFileSync("./serverless.yml", { encoding: "utf-8" })
);

const profile = options.profile || config.provider.profile || "default";
const type = options.type || "String";
const region = options.region || config.provider.region || "us-east-1";

console.log(
  `Using the AWS ${chalk.bold.green(profile)} profile to remove ${chalk.bold.green(
    params[0]
  )} in the ${chalk.bold.green(region)} region.`
);

(async () => {
  const overwrite = options.o || options.overwrite ? " --overwrite" : "";
  try {
    const command = `aws --profile ${profile} --region ${region} ssm delete-parameter --name ${
      params[0]
    }`;
    console.log(chalk.grey.dim(`> ${command}`));

    const results = await asyncExec(command, { silent: true });
    console.log(
      `\nRemoved. ${chalk.italic("Use ")}${chalk.bold.reset.yellow(
        "yarn list-secrets"
      )} ${chalk.italic("to get a list of remaining secrets. ")}${chalk.reset(" ")}`
    );
  } catch (e) {
    if (e.message.indexOf("ParameterAlreadyExists") !== -1) {
      console.log(
        `The parameter ${chalk.yellow.bold(params[0])} is ${chalk.italic(
          "already set" + chalk.reset(".")
        )} To overwrite the value you must use the "-o" or "--overwrite" flag.`
      );

      process.exit(0);
    } else {
      console.error(e.message);
    }
  }
})();
