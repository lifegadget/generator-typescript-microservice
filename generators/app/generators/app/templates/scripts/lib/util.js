"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
exports.parseArgv = (...possibleFlags) => (...possibleParams) => {
    const commandLine = process.argv.slice(2);
    const allOptions = [...possibleFlags, ...possibleParams];
    const unknownKeys = commandLine
        .filter(i => i.slice(0, 1) === "-")
        .filter(key => !allOptions.includes(key));
    if (unknownKeys.length > 0) {
        console.log(chalk_1.default.red("Unknown options used. ") + `The following key(s): `, chalk_1.default.yellow(unknownKeys.join(", ")) + " are not recognized and will be ignored.");
    }
    const optionKeyIndexes = commandLine
        .map((item, idx) => (item.slice(0, 1) === "-" ? idx : ""))
        .filter(i => i !== "");
    const params = commandLine.filter((item, idx) => !optionKeyIndexes.includes(idx) && !possibleParams.includes(commandLine[idx - 1]));
    const options = optionKeyIndexes.reduce((acc, idx) => {
        acc[commandLine[idx].replace(/\-/g, "")] = possibleParams.includes(commandLine[idx])
            ? commandLine[idx + 1]
            : true;
        return acc;
    }, {});
    return { params, options };
};
const yaml = require("js-yaml");
const fs_1 = require("fs");
function getServerlessConfig() {
    const config = yaml.safeLoad(fs_1.readFileSync(`${process.env.PWD}/serverless.yml`, { encoding: "utf-8" }));
    return config;
}
exports.getServerlessConfig = getServerlessConfig;
//# sourceMappingURL=util.js.map