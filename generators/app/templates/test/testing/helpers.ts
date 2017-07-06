import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as process from 'process';
import './test-console'; // TS declaration
import { stdout, stderr } from 'test-console';

// tslint:disable-next-line
interface Console {
    _restored: boolean;
    Console: typeof NodeJS.Console;
    assert(value: any, message?: string, ...optionalParams: any[]): void;
    dir(obj: any, options?: {showHidden?: boolean, depth?: number, colors?: boolean}): void;
    error(message?: any, ...optionalParams: any[]): void;
    info(message?: any, ...optionalParams: any[]): void;
    log(message?: any, ...optionalParams: any[]): void;
    time(label: string): void;
    timeEnd(label: string): void;
    trace(message?: any, ...optionalParams: any[]): void;
    warn(message?: any, ...optionalParams: any[]): void;
}

declare var console: Console;

export function restoreStdoutAndStderr() {
  console._restored = true;
}

export function setupEnv() {
  
  if (! process.env.AWS_STAGE) {
    process.env.AWS_STAGE = 'test';
  } 
  const current = process.env;
  const yamlConfig = yaml.safeLoad(fs.readFileSync('./env.yml', 'utf8'));
  const combined = {
    ...yamlConfig[process.env.AWS_STAGE],
    ...process.env
  };

  console.log(`Loading ENV for "${process.env.AWS_STAGE}"`);
  Object.keys(combined).forEach(key => process.env[key] = combined[key]);
  return combined;
}

export function ignoreStdout() {
  const rStdout = stdout.ignore();
  const restore = () => {
    rStdout();
  };

  return restore;
}

export function ignoreStderr() {
  const rStdErr = stderr.ignore();
  const restore = () => {
    rStdErr();
  };

  return restore;
}

export function ignoreBoth() {
  const rStdOut = stdout.ignore();
  const rStdErr = stderr.ignore();
  const restore = () => {
    rStdOut();
    rStdErr();
  };

  return restore;
}
