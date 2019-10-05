"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
/**
 * Copy's the input
 *
 * @param context the Generator object plus answers to all questions
 */
exports.processFiles = (context) => 
/**
 * Takes a `name` to represent the files being copied, and a `config` which is
 * simply an array of files which need to be processed/copied.
 */
(name, files) => {
    files.map(f => {
        if (typeof f === "object" &&
            f.condition !== undefined &&
            f.condition === false) {
            // if the file is conditional and condition evaluates to false
            // there's nothing to do
            return;
        }
        const filename = typeof f === "string" ? f : f.file;
        const from = context.templatePath(typeof f === "object" ? f.sourceFrom || filename : filename);
        const to = context.destinationPath(filename);
        try {
            if (typeof f === "object" && f.substitute) {
                context.fs.copyTpl(from, to, f.substitute);
            }
            else {
                if (from && to) {
                    console.log(`${from} => ${to}`);
                    context.fs.copy(from, to);
                }
            }
        }
        catch (e) {
            console.log(chalk_1.default `{red - Problem copying file: } "${from}" wasn't copied due to error: {red ${e.message}}`);
        }
    });
    context.log(chalk_1.default `  - Completed copying {yellow ${name}} files`);
};
//# sourceMappingURL=processFiles.js.map