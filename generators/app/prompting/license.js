"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const chalk_1 = require("chalk");
async function default_1(context) {
    const validate = validate_1.validatationFactory(context.answers);
    const license = await context.prompt([
        {
            type: "list",
            name: "license",
            message: `${chalk_1.default.bold("License: ")}${chalk_1.default.grey("What legal license for your code ")} `,
            choices: ["MIT", "BSD", "Apache", "GNU", "Proprietary", "none"],
            default() {
                return validate.deployableToNpm() ? "MIT" : "Proprietary";
            },
            store: true
        }
    ]);
    context.answers = Object.assign({}, context.answers, license);
}
exports.default = default_1;
//# sourceMappingURL=license.js.map