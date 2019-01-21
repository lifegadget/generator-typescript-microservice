import * as fs from "fs";
import { IServerlessPackage } from "common-types";
import { SERVERLESS_EXCLUDE_INCLUDE_FILE } from "../scripts";
import chalk from "chalk";

let serverless;
try {
  serverless = JSON.parse(
    fs.readFileSync(SERVERLESS_EXCLUDE_INCLUDE_FILE, { encoding: "utf-8" })
  );
} catch (e) {
  console.log(
    chalk.grey(
      `- didn't find deps analysis file; not adding global inclusions/excludions`
    )
  );
  serverless = {};
}

const pkg: IServerlessPackage = {
  individually: true,
  excludeDevDependencies: false,
  browser: false
};

if (serverless.include) {
  pkg.include = serverless.include;
}
if (serverless.exclude) {
  pkg.exclude = serverless.exclude;
}

export default pkg;
