"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const chalk_1 = __importDefault(require("chalk"));
function default_1(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const validate = validate_1.validatationFactory(context.answers);
        const testing = yield context.prompt([
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
        context.answers = Object.assign(Object.assign({}, context.answers), testing);
        const testing2 = yield context.prompt([
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
        context.answers = Object.assign(Object.assign({}, context.answers), testing2);
    });
}
exports.default = default_1;
//# sourceMappingURL=testing.js.map