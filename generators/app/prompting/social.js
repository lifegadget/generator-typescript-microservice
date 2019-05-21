"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const chalk_1 = require("chalk");
async function default_1(context) {
    const social = await context.prompt([
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
    context.answers = Object.assign({}, context.answers, social);
    const validate = validate_1.validatationFactory(context.answers);
    if (validate.twitterHandleRequired()) {
        const twitter = await context.prompt([
            {
                type: "input",
                name: "twitterHandle",
                message: `What is the twitter handle you want to associate to this repo?`,
                store: true
            }
        ]);
        context.answers = Object.assign({}, context.answers, twitter);
    }
}
exports.default = default_1;
//# sourceMappingURL=social.js.map