import { IServerlessAccountInfo } from "common-types";

export const service: (
  config: IServerlessAccountInfo
) => { service: { name: string } } = config => ({
  service: {
    name: config.name
  }
});
