// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessProvider, IServerlessAccountInfo } from "common-types";
import { iamRoleStatements } from "./iam";

export const provider = (
  config: IServerlessAccountInfo
): { provider: IServerlessProvider } => ({
  provider: {
    name: "aws",
    runtime: "nodejs12.x",
    profile: config.profile,
    stage: "dev",
    region: config.region,
    // tslint:disable-next-line:no-invalid-template-strings
    environment: {
      AWS_STAGE: "${self:custom.stage}",
      AWS_ACCOUNT: "${self:custom.accountId}",
      SERVICE_NAME: "${self:service.name}"
    },
    ...iamRoleStatements(config),

    tracing: config.tracing || false
  }
});
