"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const yaml = require("js-yaml");
const fs_1 = require("fs");
async function listSecrets(options = {}) {
    const defaults = {
        profile: "default",
        type: "String",
        region: "us-east-1"
    };
    const config = yaml.safeLoad(fs_1.readFileSync("./serverless.yml", { encoding: "utf-8" }));
    const { profile, type, region } = Object.assign({}, defaults, config.provider, options);
    const command = `aws --profile ${profile} --region ${region} ssm describe-parameters`;
    if (options.verbose) {
        console.log(chalk_1.default.grey.dim(`> ${command}\n`));
    }
    const results = await async_shelljs_1.asyncExec(command, { silent: true });
    return JSON.parse(results).Parameters;
}
exports.listSecrets = listSecrets;
async function getSecret(secret, options = { verbose: false }) {
    //
}
exports.getSecret = getSecret;
//# sourceMappingURL=aws-ssm.js.map