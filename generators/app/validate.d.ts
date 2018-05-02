import { IDictionary } from "common-types";
export declare type IValidatorFactory = (answers: IDictionary) => IValidator;
export interface IValidator {
    isServerless(): boolean;
    hasTemplating(): boolean;
    hasFirebase(): boolean;
    useTravis(): boolean;
    onGithub(): boolean;
    onBitbucket(): boolean;
    deployableToNpm(): boolean;
    twitterHandleRequired(): boolean;
    useStaticDocs(): boolean;
    useWallaby(): boolean;
    gitServerURL(): string;
}
export declare const validatationFactory: IValidatorFactory;
