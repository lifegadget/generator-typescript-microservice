"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
// https://serverless.com/framework/docs/providers/aws/cli-reference/package/
function clearOldPackageContents(dir) {
    //
}
(async () => {
    const args = process.argv.slice(2).filter(fn => fn[0] !== "-");
    const options = new Set(process.argv.slice(2).filter(fn => fn[0] === "-"));
    const stage = options.has("--prod") ? "prod" : "dev";
    const region = "us-east-1";
    const outputDir = "./serverless-package";
    console.log(chalk_1.default.yellow.bold("- 🕐  Starting packaging serverless assets"));
    try {
        await async_shelljs_1.asyncExec(`ts-node scripts/build.ts --color=true ${options.has("-ignoreLint") ? "--ignoreLint" : ""}`);
    }
    catch (e) {
        console.log(chalk_1.default.red(`- 😖  Failed to build so no attempt to deploy [${e.code}]`));
        return;
    }
    console.log(chalk_1.default.yellow(`- 🗯  Clearing the package directory [${outputDir}]`));
    async_shelljs_1.rm("-rf", outputDir);
    console.log(chalk_1.default.green(`- 👍  Package directory cleared`));
    console.log(chalk_1.default.yellow(`- 🗃  Starting packaging process with serverless into "${outputDir}" directory`));
    try {
        await async_shelljs_1.asyncExec(`sls package --stage ${stage} --region ${region}`);
        console.log(chalk_1.default.green(`- 🚀  Successful packaging`));
        await async_shelljs_1.asyncExec(`open ${outputDir}`);
    }
    catch (e) {
        console.log(chalk_1.default.red(`- 😖  Problems in deployment!\n`));
        return;
    }
})();
//# sourceMappingURL=package.js.map