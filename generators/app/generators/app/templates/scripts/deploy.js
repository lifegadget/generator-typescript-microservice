"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const yaml = require("js-yaml");
const fs = require("fs");
const util_1 = require("./lib/util");
let _serverlessConfig = null;
function serverlessConfig() {
    if (!_serverlessConfig) {
        _serverlessConfig = yaml.safeLoad(fs.readFileSync("./serverless.yml", {
            encoding: "utf-8"
        }));
    }
    return _serverlessConfig;
}
function findFunctions(input) {
    const fns = [];
    const functions = new Set(Object.keys(serverlessConfig().functions));
    input.map(i => {
        if (functions.has(i)) {
            fns.push(i);
        }
    });
    return fns;
}
function findSteps(input) {
    const steps = [];
    const stepFunctions = new Set(Object.keys(serverlessConfig().stepFunctions
        ? serverlessConfig().stepFunctions.stateMachines
        : []));
    input.map(i => {
        if (stepFunctions.has(i)) {
            steps.push(i);
        }
    });
    return steps;
}
async function build(fns) {
    try {
        await async_shelljs_1.asyncExec(`ts-node scripts/build.ts --color=true ${fns}}`);
    }
    catch (e) {
        console.error(chalk_1.default.red("- 🤯 build failed, deployment stopped"));
        process.exit();
    }
    console.log(chalk_1.default.green("- Build step completed successfully 🚀"));
    return;
}
async function deploy(stage, fns = []) {
    const msg = fns.length !== 0 ? `` : ``;
    try {
        if (fns.length === 0) {
            console.log(chalk_1.default.yellow(`- starting full serverless deployment to ${chalk_1.default.bold(stage)}`));
            console.log(chalk_1.default.grey(`- sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`));
            await async_shelljs_1.asyncExec(`sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`);
            console.log(chalk_1.default.green.bold(`- successful serverless deployment 🚀`));
        }
        else {
            const functions = findFunctions(fns);
            const steps = findSteps(fns);
            if (functions.length > 0) {
                console.log(chalk_1.default.yellow(`- deployment of ${functions.length} serverless function(s) to ${chalk_1.default.bold(stage)}: ${functions.join(", ")}`));
                const promises = [];
                functions.map(fn => {
                    promises.push(async_shelljs_1.asyncExec(`sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`));
                });
                await Promise.all(promises);
            }
            if (steps.length > 0) {
                console.log(chalk_1.default.yellow(`- deployment of ${steps.length} serverless function(s): ${steps.join(", ")} to ${chalk_1.default.bold(stage)} environment.`));
                await async_shelljs_1.asyncExec(`sls deploy --name ${fns.join(" --function ")} --stage ${stage}`);
            }
            console.log(chalk_1.default.green.bold(`- 🚀  successful serverless deployment `));
        }
    }
    catch (e) {
        console.log(chalk_1.default.red.bold(`- 💩  problem deploying!`));
    }
}
function getFunctionIfScoped() {
    return undefined;
}
// MAIN
(async () => {
    const { params, options } = util_1.parseArgv()("--help", "--profile", "--key");
    const sls = await serverlessConfig();
    const stage = options.prod ? "prod" : sls.provider.stage || "dev";
    if (!options.skip) {
        try {
            await build(params);
        }
        catch (e) {
            console.error(`failed to execute build`);
            throw e;
        }
    }
    await deploy(stage, params);
})();
//# sourceMappingURL=deploy.js.map