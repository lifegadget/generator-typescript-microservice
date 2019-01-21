import {
  LambdaCallback,
  IAWSLambdaProxyIntegrationRequest,
  getBodyFromPossibleLambdaProxyRequest,
  APIGatewayStatusCode
} from "common-types";

/**
 * Ping
 *
 * The ping handler provides some basic health data back to the API Gateway and serves as
 * simple API health test
 *
 * @param event a Lambda Proxied event from AWS Gateway
 * @param context contextual information about the execution environment
 * @param callback Lambda callback to indicate completion
 */
export function handler(
  event: IAWSLambdaProxyIntegrationRequest,
  context: IDBArrayKey,
  callback: LambdaCallback
) {
  console.log("EVENT\n", JSON.stringify(event, null, 2));
  const message = getBodyFromPossibleLambdaProxyRequest(event);
  callback(null, {
    statusCode: APIGatewayStatusCode.Success,
    body: {
      foo: 'bar'
    }
  })
}
