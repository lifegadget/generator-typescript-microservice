// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import * as rm from "rimraf";

(async () => {
  try {
    await asyncExec(`ts-node scripts/build.ts --color=true`);
  } catch (e) {
    throw new Error(`- failed to build so no attempt to deploy [${e.code}]`);
  }

  console.log(chalk.yellow.bold("- starting deployment 👍"));

  const currentVersion = String(
    await asyncExec(`node -p 'require("./package.json").version'`, {
      silent: true
    })
  ).trim();
  console.log(
    chalk.dim(
      `- In your ${chalk.bold.white("package.json")} the current version is`,
      currentVersion
    )
  );
  const info: any = JSON.parse(
    await asyncExec(`yarn info --json`, { silent: true })
  );
  const npmVersion = info.data.version.trim();
  console.log(
    chalk.dim(
      `- The latest published version on ${chalk.bold("npm")} is`,
      npmVersion
    )
  );

  if (currentVersion === npmVersion) {
    console.log(
      chalk.red.bold(
        `- Versions are the same, update your package.json before deploying 💩`
      )
    );
  } else {
    try {
      await asyncExec(`yarn publish --new-version ${currentVersion}`);
      console.log(chalk.green.bold(`- published to npm successfully 👍\n`));
    } catch (e) {
      console.log(
        chalk.red.bold(`\n- problems publishing to npm: ${e.code}  😡 `)
      );
    }
  }
})();
