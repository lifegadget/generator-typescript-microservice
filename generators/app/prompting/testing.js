"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const chalk_1 = require("chalk");
async function default_1(context) {
    const validate = validate_1.validatationFactory(context.answers);
    const testing = await context.prompt([
        {
            type: "checkbox",
            name: "testing",
            message: `${chalk_1.default.bold("Testing: ")} ${chalk_1.default.grey("which CI solutions will you use for testing")}: `,
            choices() {
                let always = [
                    {
                        name: "jenkins",
                        value: "jenkins-tests"
                    },
                    {
                        name: "shippable",
                        value: "shippable"
                    }
                ];
                const travis = {
                    name: "travis",
                    value: "travis"
                };
                const pipelines = {
                    name: "bitbucket pipelines",
                    value: "pipelines"
                };
                if (validate.onGithub()) {
                    always = [...always, travis];
                }
                if (validate.onBitbucket()) {
                    always = [...always, pipelines];
                }
                return always;
            },
            default() {
                return validate.onGithub() ? ["travis"] : [];
            }
        }
    ]);
    context.answers = Object.assign({}, context.answers, testing);
    const testing2 = await context.prompt([
        {
            type: "checkbox",
            name: "coverage",
            message: `${chalk_1.default.bold("Coverage")}: ${chalk_1.default.grey("Which CI solutions will you use for test coverage")} `,
            choices: [
                {
                    name: "jenkins",
                    value: "jenkins-coverage"
                },
                {
                    name: "coveralls",
                    value: "coveralls"
                },
                {
                    name: "codecov",
                    value: "codecov"
                }
            ],
            default() {
                return validate.useTravis() ? ["converalls"] : [];
            },
            store: true
        }
    ]);
    context.answers = Object.assign({}, context.answers, testing2);
}
exports.default = default_1;
//# sourceMappingURL=testing.js.map