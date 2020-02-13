import config from "./config";
import { safeLoad, safeDump } from "js-yaml";
import { readFile, writeFile } from "fs";
import { promisify } from "util";
import chalk from "chalk";
import * as path from "path";
const read = promisify(readFile);
const write = promisify(writeFile);

/**
 * Converts all the configuration
 */
(async () => {
  try {
    const accountInfo = safeLoad(
      await read(
        path.join(process.cwd(), "serverless-config/account-info.yml"),
        {
          encoding: "utf-8"
        }
      )
    );
    const serverlessConfig = config(accountInfo);
    console.log(
      chalk`{grey \n- account information read from {italic serverless-config/account-info.yml}}.`
    );
    await write(
      path.join(process.cwd(), "serverless.yml"),
      safeDump(serverlessConfig),
      {
        encoding: "utf-8"
      }
    );
  } catch (e) {
    console.log('Failed during "build" script run locally', e.message);
    console.log(chalk`{grey ${e.stack}}`);

    process.exit(1);
  }
})();
