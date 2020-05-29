import {
  packaging,
  custom,
  plugins,
  provider,
  service,
  resources
} from "./config-sections";
import functions from "./functions/index";
import stateMachines from "./stepFunctions/index";
import { IServerlessConfig, IServerlessAccountInfo } from "common-types";

export default (accountInfo: IServerlessAccountInfo): IServerlessConfig => {
  const hasStepFunctions = accountInfo.devDependencies.includes(
    "serverless-step-functions"
  );

  return {
    ...service(accountInfo),
    ...packaging(accountInfo),
    ...custom(accountInfo),
    ...plugins(accountInfo),
    ...provider(accountInfo),
    ...resources(accountInfo),
    ...{ functions },
    ...(hasStepFunctions ? stateMachines : {})
  };
};
