import * as chalk from 'chalk';
import { exec } from 'shelljs';
import * as rm from 'rimraf';
import * as process from 'process';
import * as Promise from 'bluebird';
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
  return new Promise<string>((resolve, reject) => {
    let scope: string;
    
    exec(`npm get files`, (code, stdout) => {
      if (!stdout || stdout === 'undefined\n') {
        console.log(
          chalk.white(
            'no files specified with "--files=file.ts" option so all files being tested'
          )
        );
        scope = '--recursive test/**/*-spec.ts';
      } else {
        scope = 'test/' + stdout.replace(/\t\r/, '').replace('*', '*');
      }

      console.log(
        chalk.green(
          `${chalk.bold('mocha')} --compilers ts:ts-node/register  ${scope}`
        )
      );
      resolve(scope);
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

function executeTests(stage: string, scope: string): void {
  process.env.AWS_STAGE = stage;
  process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
  exec(
    `mocha --debug-brk --compilers ts:ts-node/register ` +
    `--compilerOptions --require ts-node/register ` + 
    scope
  );
}

let stage: string;
let scope: string;

getExecutionStage()
  .then(stg => Promise.resolve((stage = stg)))
  .then(() => getScope())
  .then(sc => Promise.resolve((scope = sc)))
  .then(() => executeTests(stage, scope));
