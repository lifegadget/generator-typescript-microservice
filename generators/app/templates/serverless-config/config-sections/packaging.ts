import { IServerlessPackage, IServerlessAccountInfo } from "common-types";

export const packaging: (
  config: IServerlessAccountInfo
) => { package: IServerlessPackage } = config => ({
  package: {
    individually: true,
    excludeDevDependencies: true,
    browser: false
  }
});
