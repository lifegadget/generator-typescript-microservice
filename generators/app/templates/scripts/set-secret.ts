// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import * as yaml from "js-yaml";
import { parseArgv } from "./lib/util";
import { IServerlessConfig } from "common-types";
import { readFileSync } from "fs";
import { gzip } from "zlib";
import { promisify } from "util";
import { buildServerlessConfig } from "./lib/serverless";
const gzipAsync = promisify<Buffer, Buffer>(gzip);
(async () => {
  const commandLine: string[] = process.argv.slice(2);
  const { params, options } = parseArgv("--overwrite", "--compress", "-o", "--help")(
    "--type",
    "--region",
    "--profile",
    "--key"
  );
  const [param, value, ...description] = params;
  await buildServerlessConfig({ quiet: true });
  console.log(chalk.grey(`- Serverless configuration rebuilt`));

  const config: IServerlessConfig = yaml.safeLoad(
    readFileSync("./serverless.yml", { encoding: "utf-8" })
  );

  if (options.help) {
    console.log(chalk.bold.white("HELP"));
    console.log(chalk.bold.white("-----------\n"));
    console.log(
      `-o, --overwrite\t${chalk.grey(" force an overwrite on the given name")}`
    );
    console.log(
      `--compress\t${chalk.grey(" compress the value with gzip using base64")}`
    );
    console.log();

    console.log(
      `--type [${chalk.blue("varType")}]\t${chalk.grey(
        " compress the value with gzip and base64"
      )}`
    );
    console.log(
      `--profile [${chalk.blue("awsProfile")}]\t${chalk.grey(
        " change the AWS profile from the default value derived from serverless.yml"
      )}`
    );
    console.log(
      `--region [${chalk.blue("awsRegion")}]\t${chalk.grey(
        " change the region from the default value derived from serverless.yml"
      )}`
    );
    console.log(
      `--key [${chalk.blue("encryptKey")}]\t${chalk.grey(
        " explicitly set an encryption key for a SecureString"
      )}`
    );
    console.log();

    process.exit();
  }
  const profile = options.profile || config.provider.profile || "default";
  const type = options.type || "SecureString";
  const region = options.region || config.provider.region || "us-east-1";

  console.log(
    `- Using the AWS ${chalk.bold.green(profile)} profile to set ${chalk.bold.green(
      param
    )} in the ${chalk.bold.green(region)} region as a ${chalk.italic(type) +
      chalk.reset(" type")}${options.compress ? " [ compressed ]" : ""}.`
  );

  const overwrite = options.o || options.overwrite ? " --overwrite" : "";
  try {
    const c1 = (await gzipAsync(Buffer.from(value))).toString("base64");
    // const b1 = c1.toString("utf-8");
    console.log(`c1`, c1);
    // console.log(`b1`, b1);

    const desc =
      description.length > 0 ? ` --description "${description.join(" ")}"` : "";
    const key = options.key ? `--key ${options.key}` : "";
    if (key && type !== "SecureString") {
      console.error(
        `A key was provided but the type of the "${type}" does NOT require a key!`
      );
    }

    const valueToSet: string = options.compress
      ? ((await gzipAsync(Buffer.from(value))) as Buffer).toString("base64")
      : value;
    const command = `aws --profile ${profile} --region ${region} ssm put-parameter --name ${param} --type ${type} ${overwrite} ${desc} ${key}`;
    console.log(
      chalk.grey.dim(
        `> ${command} --value ${
          valueToSet.length > 120 ? valueToSet.slice(0, 120) + " ..." : valueToSet
        }`
      )
    );

    const results = await asyncExec(`${command} --value ${valueToSet}`, { silent: true });
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
