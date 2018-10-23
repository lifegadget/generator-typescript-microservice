// tslint:disable:no-implicit-dependencies
import { IServerlessConfig, IDictionary } from "common-types";
import chalk from "chalk";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

export interface IServerlessCliOptions {
  required?: boolean;
  singular?: boolean;
  quiet?: boolean;
}

const OFFSET_DIR = "serverless-config";
const BASE_DIR = process.cwd();
const CONFIG_DIR = path.join(BASE_DIR, OFFSET_DIR);

export async function buildServerlessConfig(options: IDictionary = { quiet: false }) {
  await serverless("plugins", `serverless ${chalk.bold("Plugins")}`, options);
  await serverless("functions", `serverless ${chalk.bold("Function(s)")}`, {
    required: true,
    quiet: options.quiet
  });
  await serverless(
    "stepFunctions",
    `serverless ${chalk.bold("Step Function(s)")}`,
    options
  );
  await serverless("provider", `serverless ${chalk.bold("Provider")} definition`, {
    singular: true,
    quiet: options.quiet
  });
}

export async function serverless(
  where: keyof IServerlessConfig,
  name: string,
  options: IServerlessCliOptions = { required: false, singular: false }
) {
  const lookFor = where === "package" ? "pkg" : where; // package is a reserved word
  const existsAsIndex = fs.existsSync(`${CONFIG_DIR}/${lookFor}/index.ts`);
  const existsAsFile = fs.existsSync(`${CONFIG_DIR}/${lookFor}.ts`);
  const exists = existsAsIndex || existsAsFile;

  if (exists) {
    let configSection: IDictionary = require(`${CONFIG_DIR}/${lookFor}`).default;
    if (!configSection) {
      console.log(
        `- The ${where} configuration does not export anything on default so skipping`
      );
      return;
    }
    const serverlessConfig: IServerlessConfig = yaml.safeLoad(
      fs.readFileSync("serverless.yml", {
        encoding: "utf-8"
      })
    ) as IServerlessConfig;

    const isList = Array.isArray(configSection);
    const isDefined: boolean = Object.keys(configSection).length > 0 ? true : false;

    if (!isDefined && options.required) {
      console.log(
        chalk.magenta(
          `- Warning: there exist ${name} configuration at "${CONFIG_DIR}/${lookFor} but its export is empty!`
        )
      );

      if ((Object.keys(serverlessConfig[where]).length as any) === 0) {
        console.log(
          chalk.red(`- the serverless.yml file also has no ${name} definitions!`)
        );
      } else {
        console.log(
          chalk.grey(
            `- Note: serverless.yml will continue to use the definitions for ${name} that previously existed in the file [ ${
              Object.keys(serverlessConfig[where] as IDictionary).length
            } ]`
          )
        );
        configSection = serverlessConfig[where] as IDictionary;
      }
    }
    serverlessConfig[where] = configSection;
    fs.writeFileSync("serverless.yml", yaml.dump(serverlessConfig));

    if (!options.quiet) {
      console.log(
        chalk.yellow(
          `- Injected ${
            options.singular ? "" : Object.keys(configSection).length + " "
          }${name} into serverless.yml`
        )
      );
    }
  } else {
    console.error(
      chalk.grey(`- No ${name} found in ${CONFIG_DIR}/${where}/index.ts so ignoring`)
    );
  }
}
