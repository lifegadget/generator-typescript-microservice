import {
  getBodyFromPossibleLambdaProxyRequest,
  IAwsHandlerFunction,
  ApiGatewayStatusCode,
  LambdaEventParser
} from "common-types";
import { logger } from "aws-log";

export interface IPingRequest {
  system: string;
}

export interface IPingResponse {
  statusCode: ApiGatewayStatusCode;
  body: string;
}

/**
 * Ping
 *
 * The ping function is an "example function" but it demonstrates some best practices
 * in it's structure and typing.
 *
 * @param event a event that may have come from API Gateway but could have come from another Lambda or other source
 * @param context contextual information about the execution environment
 */
export const handler: IAwsHandlerFunction<IPingRequest, IPingResponse> = async (
  event,
  context
) => {
  const log = logger().lambda(event, context);
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const { request, apiGateway } = LambdaEventParser.parse(event);
    log.info("Ping handler called", { request });
    const message = getBodyFromPossibleLambdaProxyRequest(event);
    return {
      statusCode: ApiGatewayStatusCode.Success,
      body: {
        foo: "bar"
      }
    };
  } catch (e) {
    throw new Error("Bad Ping!");
  }
};
