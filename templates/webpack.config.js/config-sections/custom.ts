import { IServerlessConfigCustom, IServerlessAccountInfo } from "common-types";

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
  // Add log forwarding if the plugin exists and there is an ARN to point at
  if (
    config.logForwarding &&
    config.devDependencies.includes("serverless-log-forwarding")
  ) {
    output.custom.logForwarding = { destinationARN: config.logForwarding };
  }

  return output;
};
