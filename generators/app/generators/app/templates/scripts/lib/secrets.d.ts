import { SSM } from "aws-sdk";
import { CredentialsOptions } from "aws-sdk/lib/credentials";
export declare function getSSM(): SSM;
export declare function getAwsCredentials(profile: string): CredentialsOptions;
export declare function getParameter(Name: string): Promise<SSM.Parameter>;
export declare function setParameter(Name: string, Value: string, options?: Partial<SSM.PutParameterRequest>): Promise<{}>;
export declare function listParameters(options?: SSM.DescribeParametersRequest): Promise<SSM.ParameterMetadata[]>;
export declare function removeParameter(Name: string, options?: Partial<SSM.DeleteParameterRequest>): Promise<SSM.DeleteParameterResult>;
