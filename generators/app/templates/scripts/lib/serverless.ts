// tslint:disable:no-implicit-dependencies
import { IServerlessConfig, IDictionary } from "common-types";
import chalk from "chalk";
import * as fs from "fs";
import * as yaml from "js-yaml";

export interface IServerlessCliOptions {
  required?: boolean;
  singular?: boolean;
}

export async function serverless(
  where: keyof IServerlessConfig,
  name: string,
  options: IServerlessCliOptions = { required: false, singular: false }
) {
  const existsAsIndex = fs.existsSync(`config/${where}/index.ts`);
  const existsAsFile = fs.existsSync(`config/${where}.ts`);
  const exists = existsAsIndex || existsAsFile;

  if (exists) {
    let configSection: IDictionary = require(`../../config/${where}`).default;
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
          `- Warning: there exist ${name} configuration at "config/${where} but its export is empty!`
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

    console.log(
      chalk.green(
        `- Injected ${
          options.singular ? "" : Object.keys(configSection).length
        } ${name} into serverless.yml 👍`
      )
    );
  } else {
    console.error(
      chalk.grey(`- No ${name} found in config/${where}/index.ts so ignoring`)
    );
  }
}
