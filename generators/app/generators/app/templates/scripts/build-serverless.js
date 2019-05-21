"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
require("../test/testing/test-console");
const serverless_1 = require("./lib/serverless");
const js_1 = require("./lib/js");
(async () => {
    try {
        await js_1.clearTranspiledJS();
        await js_1.transpileJavascript();
    }
    catch (e) {
        console.error(chalk_1.default.red("- Problem transpiling Javascript!"), e);
        process.exit(1);
    }
    try {
        console.log(chalk_1.default.yellow.bold("- Starting configuration of serverless.yml"));
        await serverless_1.buildServerlessConfig();
        console.log(chalk_1.default.green.bold("- serverless.yml file is fully configured 👍\n"));
    }
    catch (e) {
        console.log(chalk_1.default.red("- Problem with building serverless.yml file\n"), e + "\n");
        process.exit(1);
    }
    console.log("\n");
})();
//# sourceMappingURL=build-serverless.js.map