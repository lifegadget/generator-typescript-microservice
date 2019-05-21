import { IServerlessAccountInfo } from './types';
/**
 * **resources**
 *
 * Defines the `resources` property in the serverless configuration which is meant as a means
 * to define other non-core AWS resources.
 */
export declare function resources(accountInfo: IServerlessAccountInfo): {
    resources: {
        Resources: {
            PathMapping: {
                Type: string;
                DependsOn: string;
                Properties: {
                    BasePath?: string;
                    DomainName?: string;
                    RestApiId: {
                        Ref: string;
                    };
                    Stage: string;
                };
            };
            __deployment__: {
                Properties: {
                    Description: string;
                };
            };
            ApiGatewayStage: import("common-types").IApiGatewayStage;
            ApiGatewayStage2?: import("common-types").IApiGatewayStage;
            ApiGatewayStage3?: import("common-types").IApiGatewayStage;
            ApiGatewayStage4?: import("common-types").IApiGatewayStage;
            ApiGatewayStage5?: import("common-types").IApiGatewayStage;
        };
    };
};
