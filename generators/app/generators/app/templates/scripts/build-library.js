"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const shelljs_1 = require("shelljs");
require("../test/testing/test-console");
const test_console_1 = require("test-console");
const js_1 = require("./lib/js");
const async_shelljs_1 = require("async-shelljs");
function prepOutput(output) {
    return output
        .replace(/\t\r\n/, "")
        .replace("undefined", "")
        .trim();
}
async function getScope() {
    let scope;
    return new Promise(resolve => {
        const inspect = test_console_1.stdout.inspect();
        shelljs_1.exec(`npm get files`, (code, output) => {
            inspect.restore();
            const result = prepOutput(output);
            if (!result) {
                console.log(chalk_1.default.grey('no files specified with "--files=*" option so all files under src directory will be built\n'));
                scope = "";
            }
            else {
                scope = result;
            }
            resolve(scope);
        });
    });
}
(async () => {
    const scope = await getScope();
    await js_1.clearTranspiledJS();
    await js_1.transpileJavascript({ scope });
    // await transpileJavascript({ scope, configFile: "tsconfig-esm.json" });
    await async_shelljs_1.asyncExec("bili lib/index.js --format umd,umd-min,es");
})();
//# sourceMappingURL=build-library.js.map