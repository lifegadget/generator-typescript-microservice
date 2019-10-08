import { IServerlessAccountInfo } from "common-types";

export const plugins = (
  config: IServerlessAccountInfo
): { plugins: string[] } => {
  return {
    plugins: [
      "serverless-log-forwarding",
      "serverless-pseudo-parameters",
      "serverless-step-functions",
      "serverless-offline",
      "serverless-webpack"
      // 'serverless-plugin-stage-variables',
      // 'serverless-plugin-bind-deployment-id',
    ]
  };
};
