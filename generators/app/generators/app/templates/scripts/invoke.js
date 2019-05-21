"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const fs = require("fs");
const yaml = require("js-yaml");
const inquirer = require("inquirer");
async function build(fns) {
    return async_shelljs_1.asyncExec(`ts-node scripts/build.ts --color=true ${fns}`);
}
async function deploy(stage, fns = []) {
    const msg = fns.length !== 0 ? `` : ``;
    try {
        if (fns.length === 0) {
            console.log(chalk_1.default.yellow(`- starting full serverless deployment`));
            await async_shelljs_1.asyncExec(`sls deploy --aws-s3-accelerate`);
            console.log(chalk_1.default.green.bold(`- successful serverless deployment 🚀`));
        }
        else {
            console.log(chalk_1.default.yellow(`- deployment of ${fns.length} serverless function(s): ${fns.join(", ")}`));
            await async_shelljs_1.asyncExec(`sls deploy function --force --aws-s3-accelerate --function ${fns.join(" ")}`);
            console.log(chalk_1.default.green.bold(`- 🚀  successful serverless deployment `));
        }
    }
    catch (e) {
        console.log(chalk_1.default.red.bold(`- 💩  problem deploying!`));
    }
}
function invoke(fn, data) {
    const dataSource = {};
    try {
        console.log(chalk_1.default.yellow(`- invoking ${chalk_1.default.bold(fn)}`));
        console.log(chalk_1.default.grey(`- using ${chalk_1.default.bold(data)} data source`));
        const response = async_shelljs_1.asyncExec(`sls invoke local --function ${fn} --data '${data}'`);
        console.log(chalk_1.default.green("- Function invoked successfully 🚀"));
    }
    catch (e) {
        console.log(chalk_1.default.red(`- Invocation of the serverless function failed 😠`, e));
    }
}
exports.invoke = invoke;
async function chooseFunctions() {
    let config;
    try {
        config = yaml.safeLoad(fs.readFileSync("serverless.yml", { encoding: "utf-8" }));
    }
    catch (e) {
        console.log(chalk_1.default.red(`Problem loading your serverless.yml file to find functions!`, e));
        throw new Error(`can't load serverless.yml`);
    }
    const functions = Object.keys(config.functions);
    if (functions.length === 0) {
        console.log(chalk_1.default.red("- You do not have any functions defined in your serverless.yml file!"));
        throw new Error("no functions in serverless.yml");
    }
    const chosenFunction = await inquirer.prompt([
        {
            name: "which",
            type: "list",
            choices: functions,
            message: "Choose a function from list below"
        }
    ]);
    return chosenFunction.which;
}
exports.chooseFunctions = chooseFunctions;
async function lookupDataSource(name) {
    const sources = await async_shelljs_1.ls("test/data/*.json")
        .concat("default")
        .filter(n => n.match(name));
    if (sources.length === 0) {
        console.log(chalk_1.default.red(`- "${name}" is an unknown data source`));
        throw new Error("unknown-data-source");
    }
    if (sources.length > 1) {
        console.log(chalk_1.default.magenta("- your data source is ambiguous and matches more than one source"));
        console.log(chalk_1.default.grey("- matches include", sources.join(", ")));
        throw new Error("ambiguous-data-source");
    }
    return sources[0];
}
exports.lookupDataSource = lookupDataSource;
function getDataSource(name) {
    return name === "default" ? "{}" : fs.readFileSync(name, { encoding: "utf-8" });
}
exports.getDataSource = getDataSource;
async function chooseDataSource() {
    console.log(chalk_1.default.white(`-Since you haven't stated a data source, please choose one from below.`));
    console.log(chalk_1.default.grey(`-Note: you can add JSON files to "test/data" and it will be on this list`));
    const dataSources = await async_shelljs_1.ls("test/data/*.json").concat("default");
    const chosenData = await inquirer.prompt([
        {
            name: "source",
            type: "list",
            choices: dataSources,
            default: "default",
            message: "Choose a data source from list below"
        }
    ]);
    return chosenData.source;
}
exports.chooseDataSource = chooseDataSource;
function findDataSource(source) {
    //
}
exports.findDataSource = findDataSource;
(async () => {
    let [fn, dataSource] = process.argv.slice(2);
    if (!fn) {
        fn = await chooseFunctions();
    }
    dataSource = !dataSource
        ? await getDataSource(await chooseDataSource())
        : await getDataSource(await lookupDataSource(dataSource));
    await build();
    await invoke(fn, dataSource);
})();
//# sourceMappingURL=invoke.js.map