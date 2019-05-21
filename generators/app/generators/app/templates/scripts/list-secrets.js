"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const yaml = require("js-yaml");
const util_1 = require("./lib/util");
const fs_1 = require("fs");
const serverless_1 = require("./lib/serverless");
const commandLine = process.argv.slice(2);
const { params, options } = util_1.parseArgv("--json")("--region", "--profile");
const config = yaml.safeLoad(fs_1.readFileSync("./serverless.yml", { encoding: "utf-8" }));
(async () => {
    try {
        await serverless_1.buildServerlessConfig({ quiet: true });
        console.log(`- Serverless configuration rebuilt`);
        const profile = options.profile ||
            (config.provider ? config.provider.profile : undefined) ||
            "default";
        const type = options.type || "String";
        const region = options.region || config.provider.region || "us-east-1";
        console.log(`- Using the AWS ${chalk_1.default.bold.green(profile)} profile in the ${chalk_1.default.bold.green(region)} region to ${chalk_1.default.bold("list")} all parameters in ssm.`);
        const command = `aws --profile ${profile} --region ${region} ssm describe-parameters`;
        console.log(chalk_1.default.grey.dim(`> ${command}\n`));
        const results = await async_shelljs_1.asyncExec(command, { silent: true });
        if (options.json) {
            console.log(JSON.parse(results).Parameters);
        }
        else {
            JSON.parse(results).Parameters.map((param) => {
                const datetime = new Date(Math.round(param.LastModifiedDate * 1000)).toISOString();
                const who = param.LastModifiedUser.split(":").pop();
                console.log(`${chalk_1.default.green.bold(param.Name)}: ${chalk_1.default.italic.grey(param.Description)}${chalk_1.default.reset(" ")}`);
                console.log(`  - v${param.Version} of type ${chalk_1.default.yellow.bold(param.Type)}`);
                console.log(`  - Last modified on ${chalk_1.default.bold.yellow(datetime)} by ${chalk_1.default.yellow.bold(who)}`);
            });
            console.log();
        }
    }
    catch (e) {
        console.error(e.message);
        process.exit();
    }
})();
//# sourceMappingURL=list-secrets.js.map