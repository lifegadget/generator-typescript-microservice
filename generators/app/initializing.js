"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const chalk_1 = require("chalk");
exports.initializing = (context) => () => {
    const graphic = fs.readFileSync(path.join(__dirname, "../../computer.txt"), {
        encoding: "utf-8"
    });
    context.log(graphic);
    context.log(chalk_1.default.bold("\nWelcome to the " + chalk_1.default.green("TypeScript for Serverless") + " generator!\n"));
    context.log(chalk_1.default.grey(`- This template is targetted at ${chalk_1.default.white("AWS")} but -- in part -- should work with other cloud platforms as well.\n` +
        `- ${chalk_1.default.white("YARN")} is the assumed package manager; but switching to NPM should be relatively easy.\n` +
        `- the build system is written entirely in ${chalk_1.default.white("TypeScript")} rather than an external library like gulp, grunt, etc.\n\n`));
};
//# sourceMappingURL=initializing.js.map