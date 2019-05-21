"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_types_1 = require("common-types");
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
function handler(event, context, callback) {
    console.log("EVENT\n", JSON.stringify(event, null, 2));
    const message = common_types_1.getBodyFromPossibleLambdaProxyRequest(event);
    callback(null, {
        statusCode: common_types_1.APIGatewayStatusCode.Success,
        body: {
            foo: 'bar'
        }
    });
}
exports.handler = handler;
//# sourceMappingURL=ping.js.map