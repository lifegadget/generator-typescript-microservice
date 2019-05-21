"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
console.log(chalk_1.default.bold('Typescript Microservice: Help\n'));
console.log(`  ${chalk_1.default.blue("build  ")}\ttranspiles all TS to JS`);
console.log(`  ${chalk_1.default.cyan("deploy")}\tdeploy either ALL the functions or specific functions`);
console.log(`  ${chalk_1.default.blue("fns    ")}\tlists all serverless fn's defined`);
console.log(`  ${chalk_1.default.cyan("package")}\tpackages up a serverless assets but does not send them`);
console.log(`  ${chalk_1.default.blue("test    ")}\truns all mocha unit tests`);
console.log(`  ${chalk_1.default.cyan("list-secrets")}\tlist all SSM Parameters/secrets in the given AWS profile`);
console.log(`  ${chalk_1.default.blue("get-secret")}\tgets details for a specific secret`);
console.log(`  ${chalk_1.default.cyan("set-secret")}\tsets ${chalk_1.default.italic('or updates')} details for a specific secret`);
console.log(`  ${chalk_1.default.blue("remove-secret")}\tremoves a specific secret`);
console.log();
console.log(`  ${chalk_1.default.yellow("deps   ")}\tconfigures a set of excluded node_modules for you; it is preferred that you use webpack instead`);
console.log();
//# sourceMappingURL=help.js.map