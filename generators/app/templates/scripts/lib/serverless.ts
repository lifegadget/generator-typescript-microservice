// tslint:disable:no-implicit-dependencies
import {
  IServerlessConfig,
  IDictionary,
  IServerlessFunction,
  IStepFunction
} from "common-types";
import chalk from "chalk";
import * as fs from "fs";
import * as yaml from "js-yaml";
import { SLS_CONFIG_DIRECTORY, STATIC_DEPENDENCIES_FILE } from "..";

export interface IServerlessCliOptions {
  required?: boolean;
  singular?: boolean;
  quiet?: boolean;
}

export async function buildServerlessConfig(options: IDictionary = { quiet: false }) {
  await serverless("custom", `serverless ${chalk.bold("Custom")}`, options);
  await serverless("package", `serverless ${chalk.bold("Package")}`, options);
  await serverless("provider", `serverless ${chalk.bold("Provider")} definition`, {
    singular: true,
    quiet: options.quiet
  });
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
}

export async function serverless(
  where: keyof IServerlessConfig,
  name: string,
  options: IServerlessCliOptions = { required: false, singular: false }
) {
  const existsAsIndex = fs.existsSync(`${SLS_CONFIG_DIRECTORY}/${where}/index.ts`);
  const existsAsFile = fs.existsSync(`${SLS_CONFIG_DIRECTORY}/${where}.ts`);
  const exists = existsAsIndex || existsAsFile;

  if (exists) {
    let configSection: IDictionary = require(`${SLS_CONFIG_DIRECTORY}/${where}`).default;
    if (!configSection) {
      console.log(
        `- The ${where} configuration does not export anything on default so skipping`
      );
      return;
    }
    const serverlessConfig: IServerlessConfig = yaml.safeLoad(
      fs.readFileSync(`${process.env.PWD}/serverless.yml`, {
        encoding: "utf-8"
      })
    ) as IServerlessConfig;

    const isList = Array.isArray(configSection);
    const isDefined: boolean = Object.keys(configSection).length > 0 ? true : false;

    if (!isDefined && options.required) {
      console.log(
        chalk.magenta(
          `- Warning: there exist ${name} configuration at "${SLS_CONFIG_DIRECTORY}/${where} but its export is empty!`
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
    if (Object.keys(configSection).length > 0) {
      serverlessConfig[where] = configSection;

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
      if (!options.quiet) {
        console.log(chalk.grey(`- Nothing to add in section "${name}"`));
      }
      delete serverlessConfig[where];
    }
    fs.writeFileSync(`${process.env.PWD}/serverless.yml`, yaml.dump(serverlessConfig));
  } else {
    console.error(
      chalk.grey(
        `- No ${name} found in ${SLS_CONFIG_DIRECTORY}/${where}/index.ts so ignoring`
      )
    );
  }
}

/** tests whether the running function is running withing Lambda */
export function isLambda() {
  return !!((process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) || false);
}

export async function includeStaticDependencies() {
  let staticDeps;
  try {
    staticDeps = yaml.safeLoad(
      fs.readFileSync(STATIC_DEPENDENCIES_FILE, { encoding: "utf-8" })
    );
  } catch (e) {
    // ignore
  }

  if (staticDeps) {
    console.log(`- Adding static dependencies to list of inclusions/exclusions`);

    const config: IServerlessConfig = yaml.safeLoad(
      fs.readFileSync(`${process.env.PWD}/serverless.yml`, { encoding: "utf-8" })
    );
    if (staticDeps.include && Array.isArray(staticDeps.include)) {
      config.package.include = [...config.package.include, ...staticDeps.include];
    }
    if (staticDeps.exclude && Array.isArray(staticDeps.exclude)) {
      config.package.exclude = [...config.package.exclude, ...staticDeps.exclude];
    }

    fs.writeFileSync(`${process.env.PWD}/serverless.yml`, yaml.dump(config), {
      encoding: "utf-8"
    });
  }
}

export async function getFunctions() {
  return getSomething<IDictionary<IServerlessFunction>>("functions");
}

export async function getStepFunctions() {
  return getSomething<IDictionary<IStepFunction>>("stepFunctions");
}

async function getSomething<T = any>(something: string) {
  const file = fs.existsSync(`${SLS_CONFIG_DIRECTORY}/${something}.ts`)
    ? `${SLS_CONFIG_DIRECTORY}/${something}.ts`
    : `${SLS_CONFIG_DIRECTORY}/${something}/index.ts`;

  const defExport = await import(file);

  return defExport.default as T;
}
