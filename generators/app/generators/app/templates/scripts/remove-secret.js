"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const yaml = require("js-yaml");
const util_1 = require("./lib/util");
const fs_1 = require("fs");
const commandLine = process.argv.slice(2);
const { params, options } = util_1.parseArgv("--overwrite", "-o")("--type", "--region", "--profile");
const config = yaml.safeLoad(fs_1.readFileSync("./serverless.yml", { encoding: "utf-8" }));
const profile = options.profile || config.provider.profile || "default";
const type = options.type || "String";
const region = options.region || config.provider.region || "us-east-1";
console.log(`Using the AWS ${chalk_1.default.bold.green(profile)} profile to remove ${chalk_1.default.bold.green(params[0])} in the ${chalk_1.default.bold.green(region)} region.`);
(async () => {
    const overwrite = options.o || options.overwrite ? " --overwrite" : "";
    try {
        const command = `aws --profile ${profile} --region ${region} ssm delete-parameter --name ${params[0]}`;
        console.log(chalk_1.default.grey.dim(`> ${command}`));
        const results = await async_shelljs_1.asyncExec(command, { silent: true });
        console.log(`\nRemoved. ${chalk_1.default.italic("Use ")}${chalk_1.default.bold.reset.yellow("yarn list-secrets")} ${chalk_1.default.italic("to get a list of remaining secrets. ")}${chalk_1.default.reset(" ")}`);
    }
    catch (e) {
        if (e.message.indexOf("ParameterAlreadyExists") !== -1) {
            console.log(`The parameter ${chalk_1.default.yellow.bold(params[0])} is ${chalk_1.default.italic("already set" + chalk_1.default.reset("."))} To overwrite the value you must use the "-o" or "--overwrite" flag.`);
            process.exit(0);
        }
        else {
            console.error(e.message);
        }
    }
})();
//# sourceMappingURL=remove-secret.js.map