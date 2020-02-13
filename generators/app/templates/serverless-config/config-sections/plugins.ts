import stepFunctions from "../stepFunctions/index";
import { IServerlessAccountInfo } from "common-types";

export const plugins = (
  config: IServerlessAccountInfo
): { plugins: string[] } => {
  let plugins = ["serverless-pseudo-parameters"];
  if (
    stepFunctions &&
    stepFunctions.stateMachines &&
    Object.keys(stepFunctions.stateMachines).length > 0
  ) {
    plugins.push("serverless-step-functions");
  }

  const ifInstalled = [
    "serverless-offline",
    "serverless-plugin-stage-variables",
    "serverless-plugin-bind-deployment-id"
  ];

  ifInstalled.forEach(i => {
    if (config.pluginsInstalled.includes(i)) {
      plugins.push(i);
    }
  });

  return { plugins };
};
