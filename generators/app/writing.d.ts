import { IDictionary } from "common-types";
export interface IGeneratorDictionary extends IDictionary {
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
export declare const writing: (context: IGeneratorDictionary) => () => Promise<[unknown, unknown, unknown, unknown, unknown]>;
export declare const processFiles: (context: IDictionary<any>) => (name: string, config: IFileConfiguration[]) => void;
export declare const addBadge: (context: IDictionary<any>) => (badge: string) => void;
