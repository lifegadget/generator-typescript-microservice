import { IServerlessConfigCustom } from "common-types";
type IServerlessAccountInfo = import("do-devops").IServerlessAccountInfo;

export const custom = (
  config: IServerlessAccountInfo
): IServerlessConfigCustom => {
  const output = {
    custom: {
      stage: "${opt:stage, self:provider.stage}",
      region: "${opt:region, self:provider.region}",
      accountId: config.accountId,
      webpack: {
        webpackConfig: "./webpack.config.js",
        includeModules: {
          forceExclude: ["aws-sdk", "firemock", "faker"]
        },
        packager: "yarn"
      }
    } as IServerlessConfigCustom
  };
  if (config.logForwarding) {
    output.custom.logForwarding = { destinationARN: config.logForwarding };
  }

  return output;
};
