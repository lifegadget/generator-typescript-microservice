import * as chalk from 'chalk';
import { exec } from 'shelljs';
import * as rm from 'rimraf';
import * as process from 'process';
import '../test/testing/test-console';
import { stdout, stderr } from 'test-console';

function prepOutput(output: string) {
  return output.replace(/\t\r\n/, '').replace('undefined', '');
}

function getExecutionStage(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const inspect = stdout.inspect();
    exec(`npm get stage`, (code, output) => {
      inspect.restore();

      const result = prepOutput(output).trim();
      resolve(result ? result : 'test');
    });
  });
}

function getScope(): Promise<string> {
  return new Promise((resolve, reject) => {
    let fileScope: string;

    exec(`npm get files`, (code, out) => {
      if (!out || out === 'undefined\n') {
        console.log(
          chalk.white(
            'no files specified with "--files=file.ts" option so all files being tested'
          )
        );
        fileScope = '--recursive test/**/*-spec.ts';
      } else {
        const prefix = out.slice(0, 5) === 'test/'
        ? ''
        : 'test/';
        const postfix = out.slice(-5) === '-spec'
          ? ''
          : '-spec';
        out = out.split('.')[0].replace(/\W/, '');

        fileScope = prefix + out + postfix + '.ts';
      }

      console.log(
        chalk.green(
          `${chalk.bold('mocha')} --compilers ts:ts-node/register  ${fileScope}`
        )
      );
      resolve(fileScope);
    });
  });
}

/**
 * No transpiled JS files should be in TEST directories
 * as testing is using ts-node; remove these files as they
 * may represent unintentional stale tests
 */
function cleanJSTests() {
  rm.sync('test/**/*.js');
}

function executeTests(stg: string, fileScope: string): void {
  process.env.AWS_STAGE = stg;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  exec(
    `mocha --compilers ts:ts-node/register ` +
    `--compilerOptions --require ts-node/register ` +
    fileScope
  );
}

let stage: string;
let scope: string;

getExecutionStage()
  .then(stg => Promise.resolve((stage = stg)))
  .then(() => getScope())
  .then(sc => Promise.resolve((scope = sc)))
  .then(() => executeTests(stage, scope));
