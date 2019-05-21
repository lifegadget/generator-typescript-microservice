"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_sections_1 = require("./config-sections");
const functions_1 = require("./functions");
const stepFunctions_1 = require("./stepFunctions");
exports.default = (accountInfo) => {
    return Object.assign({}, config_sections_1.service(accountInfo), config_sections_1.packaging(accountInfo), config_sections_1.custom(accountInfo), config_sections_1.plugins(accountInfo), config_sections_1.provider(accountInfo), config_sections_1.resources(accountInfo), { functions: functions_1.default }, { stateMachines: stepFunctions_1.default });
};
//# sourceMappingURL=config.js.map