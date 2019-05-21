"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const process = require("process");
require("../test/testing/test-console");
const js_1 = require("./lib/js");
function prepOutput(output) {
    return output.replace(/\t\r\n/, "").replace("undefined", "");
}
function scriptNames(scripts, splitter = ", ") {
    return scripts.map(script => {
        const path = script.split("/");
        const last = path.pop().replace("-spec.ts", "");
        return chalk_1.default.grey(path.join("/") + "/" + chalk_1.default.white(last));
    });
}
async function findScripts(terms) {
    const scripts = [];
    if (terms.length === 0) {
        return [];
    }
    return async_shelljs_1.find(terms).filter(file => file.match(/\-spec\.ts/));
}
async function mochaTests(stg, searchTerms) {
    const scripts = await findScripts(searchTerms);
    process.env.AWS_STAGE = stg;
    process.env.TS_NODE_COMPILER_OPTIONS = '{ "noImplicitAny": false }';
    await async_shelljs_1.asyncExec(`mocha --require ts-node/register --exit ` + scripts.join(" "));
}
(async () => {
    const searchTerms = process.argv.slice(2).filter(fn => fn[0] !== "-");
    const options = new Set(process.argv
        .slice(2)
        .filter(fn => fn[0] === "-")
        .map(o => o.replace(/^-/, "")));
    const stage = options.has("dev") ? "dev" : "test";
    const availableScripts = await async_shelljs_1.find("./test").filter(f => f.match(/-spec\.ts/));
    const scriptsToTest = searchTerms.length > 0
        ? availableScripts.filter(s => {
            return searchTerms.reduce((prv, script) => s.match(script) || prv, 0);
        })
        : availableScripts;
    if (options.has("-ls") || options.has("-l") || options.has("list")) {
        console.log(chalk_1.default.yellow("- 🤓  The following test scripts are available:"));
        console.log("    - " + scriptNames(availableScripts).join("\n    - "));
        return;
    }
    console.log(chalk_1.default.yellow(`- 🕐  Starting testing ${stage !== "test" ? "[ stage:  " + stage + " ]" : ""}`));
    try {
        await js_1.lintSource();
        console.log(chalk_1.default.green(`- 👍  Linting found no problems  `));
    }
    catch (e) {
        if (!options.has("--ignoreLint")) {
            console.log(chalk_1.default.red.bold(`- 😖 Error with linting! ${chalk_1.default.white.dim("you can disable this by adding --ignoreLint flag\n")}`));
            process.exit(1);
        }
        else {
            console.log(`- 🦄  continuing onto mocha tests because of ${chalk_1.default.bold("--ignoreLint")} flag`);
        }
    }
    if (availableScripts.length === scriptsToTest.length) {
        console.log(chalk_1.default.yellow(`- 🏃  Running ALL ${availableScripts.length} test scripts: ${chalk_1.default.grey(scriptNames(scriptsToTest).join(", "))}`));
    }
    else {
        console.log(chalk_1.default.yellow(`- 🏃  Running ${chalk_1.default.bold(String(scriptsToTest.length))} of ${availableScripts.length} test scripts: ${chalk_1.default.grey(scriptNames(scriptsToTest).join(", "))}`));
    }
    try {
        await mochaTests(stage, scriptsToTest);
        console.log(chalk_1.default.green("- 🚀  Successful test run!\n"));
    }
    catch (e) {
        console.log(chalk_1.default.red.bold(`- 😖 Error(s) in tests.\n`));
        process.exit(1);
    }
})();
//# sourceMappingURL=test.js.map