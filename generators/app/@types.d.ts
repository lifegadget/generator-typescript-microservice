import { IDictionary } from "common-types";
import { Generator } from "./index";
export interface IGeneratorDictionary extends Generator {
    /** A dictionary of answered question asked during the "prompting" phase */
    answers: IDictionary;
}
export interface IComplexFileConfiguration {
    file: string;
    condition?: boolean;
    substitute?: IDictionary;
    /** allows you to state a source filename which is distinct from the output file name */
    sourceFrom?: string;
}
export declare type IFileConfiguration = IComplexFileConfiguration | string;
