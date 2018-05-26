import { IDictionary } from "common-types";
export interface IGeneratorDictionary extends IDictionary {
    answers: IDictionary;
}
export interface IComplexFileConfiguration {
    file: string;
    condition?: boolean;
    substitute?: IDictionary;
    sourceFrom?: string;
}
export declare type IFileConfiguration = IComplexFileConfiguration | string;
export declare const writing: (context: IGeneratorDictionary) => () => Promise<[{}, {}, {}, {}, {}, {}]>;
export declare const processFiles: (context: IDictionary<any>) => (name: string, config: IFileConfiguration[]) => void;
export declare const addBadge: (context: IDictionary<any>) => (badge: string) => void;
