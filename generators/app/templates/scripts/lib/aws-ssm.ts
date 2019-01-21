import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import * as yaml from "js-yaml";
import { parseArgv } from "./util";
import { IServerlessConfig, IDictionary, epoch } from "common-types";
import { readFileSync } from "fs";

export interface ISecretOptions {
  profile?: string;
  type?: string;
  region?: string;
  /** determines whether this function should output info to console */
  verbose?: boolean;
}

export interface ISecretList {
  Parameters: ISecretItem[];
}

export interface ISecretItem {
  Name: string;
  LastModifiedDate: epoch;
  LastModifiedUser: string;
  Description: string;
  Type: string;
  Version: string;
}

export async function listSecrets(options: ISecretOptions = {}): Promise<ISecretItem[]> {
  const defaults = {
    profile: "default",
    type: "String",
    region: "us-east-1"
  };
  const config: IServerlessConfig = yaml.safeLoad(
    readFileSync("./serverless.yml", { encoding: "utf-8" })
  );
  const { profile, type, region } = {
    ...defaults,
    ...config.provider,
    ...options
  };

  const command = `aws --profile ${profile} --region ${region} ssm describe-parameters`;
  if (options.verbose) {
    console.log(chalk.grey.dim(`> ${command}\n`));
  }

  const results: string = await asyncExec(command, { silent: true });
  return JSON.parse(results).Parameters;
}

export async function getSecret(
  secret: string,
  options: ISecretOptions = { verbose: false }
) {
  //
}
