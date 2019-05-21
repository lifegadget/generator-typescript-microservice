"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const yaml = require("js-yaml");
const util_1 = require("./lib/util");
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const util_2 = require("util");
const serverless_1 = require("./lib/serverless");
const gzipAsync = util_2.promisify(zlib_1.gzip);
(async () => {
    const commandLine = process.argv.slice(2);
    const { params, options } = util_1.parseArgv("--overwrite", "--compress", "-o", "--help")("--type", "--region", "--profile", "--key");
    const [param, value, ...description] = params;
    await serverless_1.buildServerlessConfig({ quiet: true });
    console.log(chalk_1.default.grey(`- Serverless configuration rebuilt`));
    const config = yaml.safeLoad(fs_1.readFileSync("./serverless.yml", { encoding: "utf-8" }));
    if (options.help) {
        console.log(chalk_1.default.bold.white("HELP"));
        console.log(chalk_1.default.bold.white("-----------\n"));
        console.log(`-o, --overwrite\t${chalk_1.default.grey(" force an overwrite on the given name")}`);
        console.log(`--compress\t${chalk_1.default.grey(" compress the value with gzip using base64")}`);
        console.log();
        console.log(`--type [${chalk_1.default.blue("varType")}]\t${chalk_1.default.grey(" compress the value with gzip and base64")}`);
        console.log(`--profile [${chalk_1.default.blue("awsProfile")}]\t${chalk_1.default.grey(" change the AWS profile from the default value derived from serverless.yml")}`);
        console.log(`--region [${chalk_1.default.blue("awsRegion")}]\t${chalk_1.default.grey(" change the region from the default value derived from serverless.yml")}`);
        console.log(`--key [${chalk_1.default.blue("encryptKey")}]\t${chalk_1.default.grey(" explicitly set an encryption key for a SecureString")}`);
        console.log();
        process.exit();
    }
    const profile = options.profile || config.provider.profile || "default";
    const type = options.type || "SecureString";
    const region = options.region || config.provider.region || "us-east-1";
    console.log(`- Using the AWS ${chalk_1.default.bold.green(profile)} profile to set ${chalk_1.default.bold.green(param)} in the ${chalk_1.default.bold.green(region)} region as a ${chalk_1.default.italic(type) +
        chalk_1.default.reset(" type")}${options.compress ? " [ compressed ]" : ""}.`);
    const overwrite = options.o || options.overwrite ? " --overwrite" : "";
    try {
        const c1 = (await gzipAsync(Buffer.from(value))).toString("base64");
        // const b1 = c1.toString("utf-8");
        console.log(`c1`, c1);
        // console.log(`b1`, b1);
        const desc = description.length > 0 ? ` --description "${description.join(" ")}"` : "";
        const key = options.key ? `--key ${options.key}` : "";
        if (key && type !== "SecureString") {
            console.error(`A key was provided but the type of the "${type}" does NOT require a key!`);
        }
        const valueToSet = options.compress
            ? (await gzipAsync(Buffer.from(value))).toString("base64")
            : value;
        const command = `aws --profile ${profile} --region ${region} ssm put-parameter --name ${param} --type ${type} ${overwrite} ${desc} ${key}`;
        console.log(chalk_1.default.grey.dim(`> ${command} --value ${valueToSet.length > 120 ? valueToSet.slice(0, 120) + " ..." : valueToSet}`));
        const results = await async_shelljs_1.asyncExec(`${command} --value ${valueToSet}`, { silent: true });
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
//# sourceMappingURL=set-secret.js.map