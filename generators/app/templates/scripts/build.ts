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

async function clearLib() {
  return new Promise((resolve) => {
    rm('lib', () => {
      console.log(chalk.dim('- cleared LIB directory of all previous files'));
      resolve();
    });
  });

}

async function execute(scope: string) {
  console.log(
    chalk.bold.yellow('- starting build process ')
  );
  await clearLib();

  console.log(
    chalk.dim(`- transpiling typescript ( `) +
    chalk.dim.grey(`./node_modules/.bin/tsc ${scope}`) +
    chalk.dim(` )`)
  );
  exec(`./node_modules/.bin/tsc ${scope}`, (code, out) => {
    if (code === 0) {
      console.log(chalk.green.bold(`- build completed successfully 👍\n`));
    } else {
      console.log(chalk.red.bold(`\n- Completed with code: ${code}  😡 `));
      console.log(chalk.red(`- Error was:\n`) + out + "\n");
      throw new Error('Problem with build step, see above');
    }

    return Promise.resolve();
  });
}

(async () => {
  const scope: string = await getScope();
  await execute(scope);
})();
