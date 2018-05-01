"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const lodash_1 = require("lodash");
const validate_1 = require("./validate");
const index_1 = require("./prompting/index");
function addToAnswers(source, addition) {
    source = Object.assign({}, source, addition);
}
exports.prompting = (context) => () => __awaiter(this, void 0, void 0, function* () {
    const validate = validate_1.validatationFactory(context.answers);
    const appName = yield context.prompt([
        {
            type: "input",
            name: "appName",
            message: "Your project name",
            default: lodash_1.kebabCase(context.appName),
            store: true
        }
    ]);
    context.answers = appName;
    console.log("");
    yield index_1.git(context, validate);
    console.log("");
    const projectType = yield context.prompt([
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
    context.answers = Object.assign({}, context.answers, projectType);
    console.log("");
    yield index_1.features(context, validate);
    console.log("");
    yield index_1.badging(context);
    context.badges = {
        npm: validate.deployableToNpm() ? ["npm"] : [],
        testing: context.answers.testing,
        coverage: context.answers.coverage,
        social: context.answers.social,
        license: context.answers.license
    };
    console.log("badges", context.badges);
});
exports.default = exports.prompting;
//# sourceMappingURL=prompting.js.map