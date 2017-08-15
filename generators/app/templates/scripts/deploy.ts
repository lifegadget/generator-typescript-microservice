import * as chalk from 'chalk';
import { exec } from 'shelljs';
import * as rm from 'rimraf';

exec(`ts-node scripts/build.ts --color=true`, (code) => {
  if (code === 0) {
    exec(`npm publish`, (publishCode: any) => {
      if (publishCode === 0) {
        console.log(chalk.green.bold(`- published to npm successfully 👍\n`));
      } else {
        console.log(chalk.red.bold(`\n- problems publishing to npm: ${publishCode}  😡 `));
      }
    });
  }
});
