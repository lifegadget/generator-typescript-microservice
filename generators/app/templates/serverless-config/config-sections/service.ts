type IServerlessAccountInfo = import("do-devops").IServerlessAccountInfo;

export const service: (
  config: IServerlessAccountInfo
) => { service: { name: string } } = config => ({
  service: {
    name: config.name
  }
});
