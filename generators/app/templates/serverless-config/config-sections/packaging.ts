import { IServerlessPackage } from "common-types";
type IServerlessAccountInfo = import("do-devops").IServerlessAccountInfo;

export const packaging: (
  config: IServerlessAccountInfo
) => { package: IServerlessPackage } = config => ({
  package: {
    individually: true,
    excludeDevDependencies: true,
    browser: false
  }
});
