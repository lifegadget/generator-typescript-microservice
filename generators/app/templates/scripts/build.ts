import * as chalk from 'chalk';
import { exec } from 'shelljs';
import * as rm from 'rimraf';
import * as process from 'process';
import '../test/testing/test-console';
import { stdout, stderr } from 'test-console';

function prepOutput(output: string) {
  return output.replace(/\t\r\n/, '').replace('undefined', '').trim();
}

async function getScope(): Promise<string> {
  let scope: string;

  return new Promise<string>(resolve => {
    const inspect = stdout.inspect();
    exec(`npm get files`, (code, output) => {
      inspect.restore();
      const result = prepOutput(output);

      if (!result) {
        console.log(
          chalk.grey(
            'no files specified with "--files=*" option so all files under src directory will be built\n'
          )
        );
        scope = '';
      } else {
        scope = result;
      }

      resolve(scope);
    });
  });
}

async function execute(scope: string) {
  console.log(
    chalk.bold.yellow('Executing Build: ') +
    chalk.yellow.dim(`( ./node_modules/.bin/tsc ${scope} )\n`)
  );

  exec(`./node_modules/.bin/tsc ${scope}`, (code, stdout) => {
    if (code === 0) {
      console.log(chalk.green.bold(`\nCompleted successfully`));
    } else {
      console.log(chalk.red.bold(`\nCompleted with code: ${code}`));
    }
  });
}

(async () => {
  const scope: string = await getScope();
  await execute(scope);
})();
