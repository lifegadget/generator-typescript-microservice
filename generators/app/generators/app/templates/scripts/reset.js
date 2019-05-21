"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
const rm = require("rimraf");
async function remove(dir) {
    return new Promise((resolve, reject) => {
        rm(dir, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}
(async () => {
    console.log(chalk_1.default.grey('- clearing all files out of "node_modules"'));
    await remove('node_modules');
    console.log(chalk_1.default.yellow("- removed node_modules 🤯"));
    console.log(chalk_1.default.grey('- re-installing deps using yarn'));
    try {
        await async_shelljs_1.asyncExec(`yarn && yarn update`);
        console.log(chalk_1.default.green('\n- All dependencies reset afresh'));
    }
    catch (e) {
        console.log(chalk_1.default.red('\n There were problems re-install deps\n'), e);
    }
})();
//# sourceMappingURL=reset.js.map