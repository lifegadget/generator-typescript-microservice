"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
async function default_1(context) {
    const features = await context.prompt([
        {
            type: "checkbox",
            name: "features",
            message: `${chalk_1.default.bold("Features: ")} `,
            choices: [
                {
                    name: `${chalk_1.default.yellow.bold("Vuepress")} static documentation site`,
                    value: "vuepress"
                },
                {
                    name: `${chalk_1.default.yellow.bold("Wallaby")} configuration`,
                    value: "wallaby"
                },
                {
                    name: `Add ${chalk_1.default.yellow.bold("typed-template")} and directories to support for structured templating requirements`,
                    value: "typed-template"
                },
                {
                    name: `${chalk_1.default.bold.yellow("Firebase")} via ${chalk_1.default.bold("firemodel")} and ${chalk_1.default.bold("abstracted-admin")}`,
                    value: "firebase"
                },
                {
                    name: `${chalk_1.default.bold.yellow("NPM")} deployment`,
                    value: "npm"
                }
            ],
            default: ["wallaby"],
            store: true
        }
    ]);
    context.answers = Object.assign(Object.assign({}, context.answers), features);
}
exports.default = default_1;
//# sourceMappingURL=features.js.map