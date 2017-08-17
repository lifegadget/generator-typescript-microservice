import { IDictionary } from 'common-types';
import { first, last } from 'lodash';
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
    console._restored = true;
  };

  return restore;
}

export function captureStdout(): () => any {
  const rStdout: IAsyncStreamCallback = stdout.inspect();
  const restore = () => {
    rStdout.restore();
    console._restored = true;
    return rStdout.output;
  };

  return restore;
}

export function captureStderr(): () => any {
  const rStderr: IAsyncStreamCallback = stderr.inspect();
  const restore = () => {
    rStderr.restore();
    console._restored = true;
    return rStderr.output;
  };

  return restore;
}

export function ignoreStderr() {
  const rStdErr = stderr.ignore();
  const restore = () => {
    rStdErr();
    console._restored = true;
  };

  return restore;
}

export function ignoreBoth() {
  const rStdOut = stdout.ignore();
  const rStdErr = stderr.ignore();
  const restore = () => {
    rStdOut();
    rStdErr();
    console._restored = true;
  };

  return restore;
}

/**
 * The first key in a Hash/Dictionary
 */
export function firstKey<T = any>(dictionary: IDictionary<T>) {
  return first(Object.keys(dictionary));
}

/**
 * The first record in a Hash/Dictionary of records
 */
export function firstRecord<T = any>(dictionary: IDictionary<T>) {
  return dictionary[this.firstKey(dictionary)];
}

/**
 * The last key in a Hash/Dictionary
 */
export function lastKey<T = any>(listOf: IDictionary<T>) {
  return last(Object.keys(listOf));
}

/**
 * The last record in a Hash/Dictionary of records
 */
export function lastRecord<T = any>(dictionary: IDictionary<T>) {
  return dictionary[this.lastKey(dictionary)];
}

export function valuesOf<T = any>(listOf: IDictionary<T>, property: string) {
  const keys: any[] = Object.keys(listOf);
  return keys.map((key: any) => {
    const item: IDictionary = listOf[key];
    return item[property];
  });
}

export function length(listOf: IDictionary) {
  return listOf ? Object.keys(listOf).length : 0;
}
