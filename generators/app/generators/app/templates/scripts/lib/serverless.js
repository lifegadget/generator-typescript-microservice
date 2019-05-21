"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs = require("fs");
const yaml = require("js-yaml");
const __1 = require("..");
async function buildServerlessConfig(options = { quiet: false }) {
    await serverless("custom", `serverless ${chalk_1.default.bold("Custom")}`, options);
    await serverless("package", `serverless ${chalk_1.default.bold("Package")}`, options);
    await serverless("provider", `serverless ${chalk_1.default.bold("Provider")} definition`, {
        singular: true,
        quiet: options.quiet
    });
    await serverless("plugins", `serverless ${chalk_1.default.bold("Plugins")}`, options);
    await serverless("functions", `serverless ${chalk_1.default.bold("Function(s)")}`, {
        required: true,
        quiet: options.quiet
    });
    await serverless("stepFunctions", `serverless ${chalk_1.default.bold("Step Function(s)")}`, options);
}
exports.buildServerlessConfig = buildServerlessConfig;
async function serverless(where, name, options = { required: false, singular: false }) {
    const existsAsIndex = fs.existsSync(`${__1.SLS_CONFIG_DIRECTORY}/${where}/index.ts`);
    const existsAsFile = fs.existsSync(`${__1.SLS_CONFIG_DIRECTORY}/${where}.ts`);
    const exists = existsAsIndex || existsAsFile;
    if (exists) {
        let configSection = require(`${__1.SLS_CONFIG_DIRECTORY}/${where}`).default;
        if (!configSection) {
            console.log(`- The ${where} configuration does not export anything on default so skipping`);
            return;
        }
        const serverlessConfig = yaml.safeLoad(fs.readFileSync(`${process.env.PWD}/serverless.yml`, {
            encoding: "utf-8"
        }));
        const isList = Array.isArray(configSection);
        const isDefined = Object.keys(configSection).length > 0 ? true : false;
        if (!isDefined && options.required) {
            console.log(chalk_1.default.magenta(`- Warning: there exist ${name} configuration at "${__1.SLS_CONFIG_DIRECTORY}/${where} but its export is empty!`));
            if (Object.keys(serverlessConfig[where]).length === 0) {
                console.log(chalk_1.default.red(`- the serverless.yml file also has no ${name} definitions!`));
            }
            else {
                console.log(chalk_1.default.grey(`- Note: serverless.yml will continue to use the definitions for ${name} that previously existed in the file [ ${Object.keys(serverlessConfig[where]).length} ]`));
                configSection = serverlessConfig[where];
            }
        }
        if (Object.keys(configSection).length > 0) {
            serverlessConfig[where] = configSection;
            if (!options.quiet) {
                console.log(chalk_1.default.yellow(`- Injected ${options.singular ? "" : Object.keys(configSection).length + " "}${name} into serverless.yml`));
            }
        }
        else {
            if (!options.quiet) {
                console.log(chalk_1.default.grey(`- Nothing to add in section "${name}"`));
            }
            delete serverlessConfig[where];
        }
        fs.writeFileSync(`${process.env.PWD}/serverless.yml`, yaml.dump(serverlessConfig));
    }
    else {
        console.error(chalk_1.default.grey(`- No ${name} found in ${__1.SLS_CONFIG_DIRECTORY}/${where}/index.ts so ignoring`));
    }
}
exports.serverless = serverless;
/** tests whether the running function is running withing Lambda */
function isLambda() {
    return !!((process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV) || false);
}
exports.isLambda = isLambda;
async function includeStaticDependencies() {
    let staticDeps;
    try {
        staticDeps = yaml.safeLoad(fs.readFileSync(__1.STATIC_DEPENDENCIES_FILE, { encoding: "utf-8" }));
    }
    catch (e) {
        // ignore
    }
    if (staticDeps) {
        console.log(`- Adding static dependencies to list of inclusions/exclusions`);
        const config = yaml.safeLoad(fs.readFileSync(`${process.env.PWD}/serverless.yml`, { encoding: "utf-8" }));
        if (staticDeps.include && Array.isArray(staticDeps.include)) {
            config.package.include = [...config.package.include, ...staticDeps.include];
        }
        if (staticDeps.exclude && Array.isArray(staticDeps.exclude)) {
            config.package.exclude = [...config.package.exclude, ...staticDeps.exclude];
        }
        fs.writeFileSync(`${process.env.PWD}/serverless.yml`, yaml.dump(config), {
            encoding: "utf-8"
        });
    }
}
exports.includeStaticDependencies = includeStaticDependencies;
async function getFunctions() {
    return getSomething("functions");
}
exports.getFunctions = getFunctions;
async function getStepFunctions() {
    return getSomething("stepFunctions");
}
exports.getStepFunctions = getStepFunctions;
async function getSomething(something) {
    const file = fs.existsSync(`${__1.SLS_CONFIG_DIRECTORY}/${something}.ts`)
        ? `${__1.SLS_CONFIG_DIRECTORY}/${something}.ts`
        : `${__1.SLS_CONFIG_DIRECTORY}/${something}/index.ts`;
    const defExport = await Promise.resolve().then(() => require(file));
    return defExport.default;
}
//# sourceMappingURL=serverless.js.map