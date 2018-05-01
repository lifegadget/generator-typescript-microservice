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
function default_1(context, validate) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = yield context.prompt([
            {
                type: "input",
                name: "repo",
                message: `${chalk_1.default.bold("Repo: ")} ${chalk_1.default.grey("what name will the GIT repo have? ")}`,
                default: lodash_1.kebabCase(context.answers.appName),
                store: true
            },
            {
                type: "list",
                name: "gitServer",
                choices: ["github", "bitbucket", "gitlab", "other"],
                message: `${chalk_1.default.bold("Git: ")} ${chalk_1.default.grey("which git server you will use? ")}`,
                default: "github",
                store: true
            }
        ]);
        context.answers = Object.assign({}, context.answers, git);
        if (new Set(["bitbucket", "github"]).has(context.answers.gitServer)) {
            const git2 = yield context.prompt([
                {
                    type: "input",
                    name: "repoUserName",
                    message: `${chalk_1.default.bold("Git Username: ")} ${chalk_1.default.grey("what is the username or group/org this repo is owned by? ")}`,
                    default: context.user.git
                        .name()
                        .slice(0, 1)
                        .toUpperCase() + lodash_1.camelCase(context.user.git.name().slice(1)),
                    store: true
                }
            ]);
            git2.repoOrigin =
                context.answers.gitServer === "bitbucket"
                    ? `git@bitbucket.org:${git2.repoUserName}/${context.answers.repo}.git`
                    : `git@github.com:${git2.repoUserName}/${context.answers.repo}.git`;
            context.log("origin: ", git2.repoOrigin);
            context.answers = Object.assign({}, context.answers, git2);
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=git.js.map