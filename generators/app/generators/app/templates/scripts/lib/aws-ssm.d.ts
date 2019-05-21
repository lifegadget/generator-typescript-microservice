import { epoch } from "common-types";
export interface ISecretOptions {
    profile?: string;
    type?: string;
    region?: string;
    /** determines whether this function should output info to console */
    verbose?: boolean;
}
export interface ISecretList {
    Parameters: ISecretItem[];
}
export interface ISecretItem {
    Name: string;
    LastModifiedDate: epoch;
    LastModifiedUser: string;
    Description: string;
    Type: string;
    Version: string;
}
export declare function listSecrets(options?: ISecretOptions): Promise<ISecretItem[]>;
export declare function getSecret(secret: string, options?: ISecretOptions): Promise<void>;
