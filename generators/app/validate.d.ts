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
    useCoveralls(): boolean;
    useCodecov(): boolean;
    gitServerURL(): string;
}
/**
 * Provides a bunch of characteristics of the project based on the
 * interactive session that the user was brought through.
 *
 * Examples are:
 *  - isServerless
 *  - hasTemplating
 *  - useWallaby
 */
export declare const validatationFactory: IValidatorFactory;
