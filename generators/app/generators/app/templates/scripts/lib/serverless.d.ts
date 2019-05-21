import { IServerlessConfig, IDictionary, IServerlessFunction, IStepFunction } from "common-types";
export interface IServerlessCliOptions {
    required?: boolean;
    singular?: boolean;
    quiet?: boolean;
}
export declare function buildServerlessConfig(options?: IDictionary): Promise<void>;
export declare function serverless(where: keyof IServerlessConfig, name: string, options?: IServerlessCliOptions): Promise<void>;
/** tests whether the running function is running withing Lambda */
export declare function isLambda(): boolean;
export declare function includeStaticDependencies(): Promise<void>;
export declare function getFunctions(): Promise<IDictionary<IServerlessFunction>>;
export declare function getStepFunctions(): Promise<IDictionary<IStepFunction>>;
