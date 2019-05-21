import { IDictionary } from "common-types";
export declare const DEP_ANALYSIS_FILE: string;
interface IAnalysis {
    singleNamedDepInDep: string[];
    singleNamedDepNotInDep: string[];
    multiDepInTopLevelDep: string[];
    multiDepNotInTopLevelDep: string[];
    noDeps: string[];
    /** modules with only multiple dependencies */
    multiDep: string[];
    /** modules with only a single dependency */
    singleNamedDep: string[];
    /** The given module ONLY has one dependency and it's in devDeps not Deps */
    onlyDevDep: string[];
}
export interface IDeps {
    dependencies?: string[];
    devDependencies?: string[];
    nodeModules?: string[];
    typingDeps?: string[];
    functions?: IDictionary;
    unrelatedToDeps?: string[];
    analysis?: IAnalysis;
}
export declare function depsList(): Promise<IDictionary>;
export declare function devDepsList(): Promise<IDictionary>;
export declare function functionsList(): Promise<{}>;
export declare function nodeModulesDirectories(): Promise<{
    nodeModules: any;
}>;
export declare function depAnalysis(data: IDeps): Promise<IDictionary>;
export declare function getYarnWhy(dep: string, dependencies: any, errors: IDictionary[]): Promise<any>;
export {};
