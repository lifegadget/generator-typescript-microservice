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
const validate_1 = require("../validate");
const chalk_1 = require("chalk");
function default_1(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const validate = validate_1.validatationFactory(context.answers);
        const badging = yield context.prompt([
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
            },
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
                    return [];
                }
            },
            {
                type: "list",
                name: "license",
                message: `${chalk_1.default.bold("License: ")}${chalk_1.default.grey("What legal license for your code ")} `,
                choices: ["MIT", "BSD", "Apache", "GNU", "Proprietary", "none"],
                default() {
                    return validate.deployableToNpm() ? "MIT" : "Proprietary";
                }
            },
            {
                type: "checkbox",
                name: "social",
                message: `${chalk_1.default.bold("Social: ")} ${chalk_1.default.grey(" social badges on README")} `,
                choices: [
                    {
                        name: "Github forks",
                        value: "forks"
                    },
                    {
                        name: "Github stars",
                        value: "stars"
                    },
                    {
                        name: "Github watchers",
                        value: "watchers"
                    },
                    {
                        name: "Github followers",
                        value: "followers"
                    },
                    {
                        name: "Twitter",
                        value: "twitter"
                    },
                    {
                        name: "Twitter w/ follow count",
                        value: "twitter-follow"
                    }
                ],
                default() {
                    return [];
                }
            }
        ]);
        context.answers = Object.assign({}, context.answers, badging);
    });
}
exports.default = default_1;
//# sourceMappingURL=badging.js.map