"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = require("lodash");
const validate_1 = require("./validate");
const index_1 = require("./prompting/index");
const testing_1 = __importDefault(require("./prompting/testing"));
const async_shelljs_1 = require("async-shelljs");
function addToAnswers(source, addition) {
    source = Object.assign(Object.assign({}, source), addition);
}
exports.prompting = (context) => async () => {
    const validate = validate_1.validatationFactory(context.answers);
    const dirName = async_shelljs_1.pwd()
        .split(/[\/\\]/)
        .pop();
    const appName = await context.prompt([
        {
            type: "input",
            name: "appName",
            message: "Your project name",
            default: lodash_1.kebabCase(context.appname) || lodash_1.kebabCase(dirName),
            store: true
        }
    ]);
    context.answers = appName;
    console.log("");
    await index_1.git(context, validate);
    console.log("");
    const projectType = await context.prompt([
        {
            type: "list",
            name: "serverless",
            choices: [
                { value: "serverless", name: "Serverless project using Typescript" },
                { value: "library-function", name: "Typescript Library function" }
            ],
            message: `${chalk_1.default.bold("Project Type: ")} `,
            default: "serverless",
            store: true
        }
    ]);
    context.answers = Object.assign(Object.assign({}, context.answers), projectType);
    console.log("");
    await index_1.features(context);
    console.log("");
    await index_1.license(context);
    console.log("");
    await testing_1.default(context);
    await index_1.social(context);
    context.badges = {
        npm: validate.deployableToNpm() ? ["npm"] : [],
        testing: context.answers.testing,
        coverage: context.answers.coverage,
        social: context.answers.social,
        license: context.answers.license
    };
};
exports.default = exports.prompting;
//# sourceMappingURL=prompting.js.map