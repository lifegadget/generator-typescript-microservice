import { IServerlessConfig } from "common-types";
export declare const parseArgv: (...possibleFlags: string[]) => (...possibleParams: string[]) => {
    params: string[];
    options: any;
};
export declare function getServerlessConfig(): IServerlessConfig<any>;
