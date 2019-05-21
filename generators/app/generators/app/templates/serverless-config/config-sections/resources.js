"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable-next-line:no-implicit-dependencies
const common_types_1 = require("common-types");
const plugins_1 = require("./plugins");
/**
 * **resources**
 *
 * Defines the `resources` property in the serverless configuration which is meant as a means
 * to define other non-core AWS resources.
 */
function resources(accountInfo) {
    const config = common_types_1.createBindDeploymentConfig({
        service: accountInfo.name,
        stage: process.env.NODE_ENV || 'dev',
    });
    const pluginsUsed = plugins_1.plugins(accountInfo).plugins;
    const usingDeploymentIdPlugin = pluginsUsed.includes('serverless-plugin-bind-deployment-id');
    const apiGatewayLogging = usingDeploymentIdPlugin ? config : {};
    return Object.assign({}, apiGatewayLogging, config);
}
exports.resources = resources;
//# sourceMappingURL=resources.js.map