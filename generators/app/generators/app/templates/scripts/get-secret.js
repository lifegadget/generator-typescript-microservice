"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const util_1 = require("./lib/util");
const zlib_1 = require("zlib");
const util_2 = require("util");
const aws_ssm_1 = require("./lib/aws-ssm");
const serverless_1 = require("./lib/serverless");
const secrets_1 = require("./lib/secrets");
const gzipAsync = util_2.promisify(zlib_1.gzip);
(async () => {
    const { params, options } = util_1.parseArgv()("--region", "--profile", "--key");
    const [param, value] = params;
    await serverless_1.buildServerlessConfig({ quiet: true });
    console.log(chalk_1.default.grey(`- Serverless configuration rebuilt`));
    const config = util_1.getServerlessConfig();
    const profile = options.profile || config.provider.profile || process.env.AWS_PROFILE || "default";
    const region = options.region || config.provider.region || "us-east-1" || process.env.AWS_REGION;
    try {
        if (!param) {
            console.log(`You must state a variable name: ${chalk_1.default.grey("yarn get-secret [VAR]")}`);
            console.log();
            console.log(`Variables in the "${profile}" AWS profile include:`);
            const secrets = await aws_ssm_1.listSecrets();
            console.log();
            console.log(secrets.map(i => `  > ${i.Name}`).join("\n"));
            console.log();
            process.exit();
        }
        console.log(`- Using the AWS ${chalk_1.default.bold.green(profile)} profile to get ${chalk_1.default.bold.green(param)} in the ${chalk_1.default.bold.green(region)} region${options.compress ? " [ compressed ]" : ""}.`);
        const key = options.key ? `--key ${options.key}` : "";
        const valueToSet = options.decompress
            ? (await gzipAsync(Buffer.from(value))).toString("utf-8")
            : value;
        const command = `aws --profile ${profile} --region ${region} ssm get-parameters --names ${param} `;
        console.log(chalk_1.default.grey.dim(`> ${command}`));
        const results = await secrets_1.getParameter(param);
        console.log(options.v || options.verbose ? results : results.Value);
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
//# sourceMappingURL=get-secret.js.map