"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./validate");
function install(context) {
    const validate = validate_1.validatationFactory(context.answers);
    context.log("Installing Yarn dependencies ...");
    const typings = [
        "@types/aws-sdk",
        "@types/chai",
        "@types/lodash",
        "@types/mocha",
        "@types/rimraf",
        "@types/chance",
        "@types/faker",
        "@types/js-yaml"
    ];
    const globaldevDeps = [
        "async-shelljs",
        "chai",
        "chance",
        "faker",
        "handlebars",
        "inquirer",
        "lodash.first",
        "lodash.last",
        "mocha",
        "coveralls",
        "nyc",
        "prettier",
        "rimraf",
        "tslint",
        "tslint-config-prettier",
        "typescript",
        "ts-node",
        "test-console",
        "simple-git"
    ];
    const serverlessOnlyDevDeps = [
        "serverless",
        "serverless-pseudo-parameters",
        "serverless-step-functions",
        "js-yaml"
    ];
    let devDeps = [...typings, ...globaldevDeps];
    if (validate.isServerless()) {
        devDeps = [...devDeps, ...serverlessOnlyDevDeps];
    }
    if (validate.useStaticDocs()) {
        devDeps = [...devDeps, "vuepress"];
    }
    let deps = ["common-types"];
    if (validate.hasTemplating()) {
        deps = [...deps, ...["typed-template"]];
    }
    if (validate.hasFirebase()) {
        deps = [...deps, ...["abstracted-admin", "firemodel"]];
    }
    context.spawnCommand("yarn", []);
    context.yarnInstall(devDeps, { dev: true });
    context.yarnInstall(deps);
}
exports.install = install;
//# sourceMappingURL=install.js.map