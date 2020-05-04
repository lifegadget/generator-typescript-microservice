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
        const social = yield context.prompt([
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
                        value: "twitterFollow"
                    }
                ],
                default() {
                    return [];
                },
                store: true
            }
        ]);
        context.answers = Object.assign(Object.assign({}, context.answers), social);
        const validate = validate_1.validatationFactory(context.answers);
        if (validate.twitterHandleRequired()) {
            const twitter = yield context.prompt([
                {
                    type: "input",
                    name: "twitterHandle",
                    message: `What is the twitter handle you want to associate to this repo?`,
                    store: true
                }
            ]);
            context.answers = Object.assign(Object.assign({}, context.answers), twitter);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=social.js.map