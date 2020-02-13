import {
  IServerlessBindDeploymentIdPlugin,
  createBindDeploymentConfig,
  IServerlessStage,
  IServerlessAccountInfo
} from "common-types";
import { plugins } from "./plugins";

/**
 * **resources**
 *
 * Defines the `resources` property in the serverless configuration which is meant as a means
 * to define other non-core AWS resources.
 */
export function resources(accountInfo: IServerlessAccountInfo) {
  const config: IServerlessBindDeploymentIdPlugin = createBindDeploymentConfig({
    service: accountInfo.name,
    stage: (process.env.NODE_ENV as IServerlessStage) || "dev"
  });
  const resources = {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": `'*'`,
            "gatewayresponse.header.Access-Control-Allow-Headers": `'*'`
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          }
        }
      }
    }
  };
  const pluginsUsed = plugins(accountInfo).plugins;
  const usingDeploymentIdPlugin = pluginsUsed.includes(
    "serverless-plugin-bind-deployment-id"
  );
  const apiGatewayLogging = usingDeploymentIdPlugin ? config : {};

  return { ...apiGatewayLogging, ...resources };
}
