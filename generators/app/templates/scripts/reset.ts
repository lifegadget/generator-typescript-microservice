// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { exec, asyncExec } from "async-shelljs";
import * as rm from "rimraf";

async function remove(dir: string) {
  return new Promise((resolve, reject) => {
    rm(dir, (err) => {
      if(err) {
        reject(err)
      }
      resolve();
    })
  })
}

(async() => {
  console.log(chalk.grey('- clearing all files out of "node_modules"'));
  await remove('node_modules');
  console.log(chalk.yellow("- removed node_modules 🤯"));
  console.log(chalk.grey('- re-installing deps using yarn'));
  try {
    await asyncExec(`yarn && yarn update`);
    console.log(chalk.green('\n- All dependencies reset afresh'));
  } catch(e) {
    console.log(chalk.red('\n There were problems re-install deps\n'), e);
  }

})();
