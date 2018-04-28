/// <reference types="yeoman-generator" />
import Generator = require("yeoman-generator");
import { IDictionary } from "common-types";
export interface IComplexFileConfiguration {
    file: string;
    condition?: boolean;
    substitute?: IDictionary;
}
export declare class TypescriptMicroservice extends Generator {
    constructor(args: any[], opts: any);
    options: IDictionary;
    initializing(): void;
    prompting(): Promise<void>;
    writing: {
        testResources: () => Promise<{}>;
        projectResources: () => Promise<{}>;
        buildScripts: () => Promise<{}>;
        configResources: () => Promise<{}>;
    };
    private _private_processFiles(name, config);
    install(): Promise<void>;
    end(): void;
}
export default TypescriptMicroservice;
