import { IServerlessAccountInfo } from "common-types";
import { IDictionary } from "common-types";

export const custom = (
  config: IServerlessAccountInfo
): IServerlessCustomConfig => ({
  custom: {
    stage: "${opt:stage, self:provider.stage}",
    region: "${opt:region, self:provider.region}",
    accountId: config.accountId,
    webpack: {
      webpackConfig: "./webpack.config.js",
      includeModules: {
        forceExclude: ["aws-sdk", "faker", "firemock"]
      },
      packager: "yarn"
    },
    logForwarding: {
      destinationARN:
        "arn:aws:lambda:${self:custom.region}:${self:custom.accountId}:function:logzio-shipper-${self:custom.stage}-logzioShipper"
    },
    authorizer: {
      name: "customAuthorizer",
      resultTtlInSeconds: 0,
      identitySource: "method.request.header.Authorization",
      type: "token"
    }
  } as IServerlessCustomConfig
});

export interface IServerlessCustomConfig extends IDictionary {
  stage?: string;
  region?: string;
  accountId?: string;
  webpack?: any;
}
