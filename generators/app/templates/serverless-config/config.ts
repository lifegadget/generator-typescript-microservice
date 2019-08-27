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
import { IServerlessConfig } from "common-types";
type IServerlessAccountInfo = import("do-devops").IServerlessAccountInfo;

export default (accountInfo: IServerlessAccountInfo): IServerlessConfig => {
  return {
    ...service(accountInfo),
    ...packaging(accountInfo),
    ...custom(accountInfo),
    ...plugins(accountInfo),
    ...provider(accountInfo),
    ...resources(accountInfo),
    ...{ functions },
    ...{ stateMachines }
  };
};
