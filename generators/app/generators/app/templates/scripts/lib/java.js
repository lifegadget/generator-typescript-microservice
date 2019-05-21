"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-implicit-dependencies
const chalk_1 = require("chalk");
const async_shelljs_1 = require("async-shelljs");
async function javaCompile() {
    console.log(chalk_1.default.green(`- Packaging all Java files into a JAR`));
    try {
        await async_shelljs_1.asyncExec(`mvn package`);
        console.log(chalk_1.default.green(`- Java class files compiled 👍`));
    }
    catch (e) {
        console.log(chalk_1.default.red(`- Java build/packaging failed 😡`));
        process.exit(1);
    }
}
exports.javaCompile = javaCompile;
async function mavenClean() {
    await async_shelljs_1.asyncExec("mvn clean");
    return;
}
exports.mavenClean = mavenClean;
//# sourceMappingURL=java.js.map