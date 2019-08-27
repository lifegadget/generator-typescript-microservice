import stepFunctions from "../stepFunctions/index";
type IServerlessAccountInfo = import("do-devops").IServerlessAccountInfo;

export const plugins = (
  config: IServerlessAccountInfo
): { plugins: string[] } => {
  let plugins = ["serverless-webpack", "serverless-pseudo-parameters"];
  if (
    stepFunctions &&
    stepFunctions.stateMachines &&
    Object.keys(stepFunctions.stateMachines).length > 0
  ) {
    plugins.push("serverless-step-functions");
  }

  if (config.logForwarding) {
    plugins.push("serverless-log-forwarding");
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
