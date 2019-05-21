"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
(async () => {
    try {
        await async_shelljs_1.asyncExec(`ts-node scripts/build.ts --color=true`);
    }
    catch (e) {
        throw new Error(`- failed to build so no attempt to deploy [${e.code}]`);
    }
    console.log(chalk_1.default.yellow.bold("- starting publishing"));
    const currentVersion = String(await async_shelljs_1.asyncExec(`node -p 'require("./package.json").version'`, {
        silent: true
    })).trim();
    console.log(chalk_1.default.dim(`- In your ${chalk_1.default.bold.white("package.json")} the current version is`, currentVersion));
    const info = JSON.parse(await async_shelljs_1.asyncExec(`yarn info --json`, { silent: true }));
    const npmVersion = info.data.version.trim();
    console.log(chalk_1.default.dim(`- The latest published version on ${chalk_1.default.bold("npm")} is`, npmVersion));
    if (currentVersion === npmVersion) {
        console.log(chalk_1.default.red.bold(`- Versions are the same, update your package.json before deploying 💩`));
    }
    else {
        try {
            await async_shelljs_1.asyncExec(`yarn publish --new-version ${currentVersion}`);
            console.log(chalk_1.default.green.bold(`- published to npm successfully 👍\n`));
        }
        catch (e) {
            console.log(chalk_1.default.red.bold(`\n- problems publishing to npm: ${e.code}  😡 `));
        }
    }
})();
//# sourceMappingURL=publish.js.map