import { IDictionary } from "common-types";
import "./test-console";
export declare type IRestoreConsole<T = void> = () => T;
export declare function restoreStdoutAndStderr(): void;
export declare function timeout(ms: number): Promise<{}>;
export declare function setupEnv(): IDictionary<any>;
export declare function ignoreStdout(): () => void;
export declare function captureStdout(): () => string[];
export declare function captureStderr(): () => string[];
export declare function ignoreStderr(): () => void;
export declare function ignoreBoth(): () => void;
/**
 * The first key in a Hash/Dictionary
 */
export declare function firstKey<T = any>(dictionary: IDictionary<T>): string;
/**
 * The first record in a Hash/Dictionary of records
 */
export declare function firstRecord<T = any>(dictionary: IDictionary<T>): T;
/**
 * The last key in a Hash/Dictionary
 */
export declare function lastKey<T = any>(listOf: IDictionary<T>): string;
/**
 * The last record in a Hash/Dictionary of records
 */
export declare function lastRecord<T = any>(dictionary: IDictionary<T>): T;
export declare function valuesOf<T = any>(listOf: IDictionary<T>, property: string): any[];
export declare function length(listOf: IDictionary): number;
export declare function loadData(file: string): Promise<string>;
export declare function loadTemplate(file: string, replacements?: IDictionary): Promise<string>;
