"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = require("lodash");
const async_shelljs_1 = require("async-shelljs");
async function gitStatus(dir = __dirname) {
    // tslint:disable-next-line:no-submodule-imports
    const git = require("simple-git/promise")(dir);
    let statusSummary = null;
    try {
        statusSummary = await git(dir).status();
    }
    catch (e) {
        console.warn(`WARN: There was an issue getting git status: `, e);
    }
    return statusSummary;
}
async function gitIsRepo(dir = __dirname) {
    // tslint:disable-next-line:no-submodule-imports
    const git = require("simple-git/promise")(dir);
    const isRepo = await git.checkIsRepo();
    return isRepo;
}
async function gitRemotes(dir = __dirname) {
    const remote = (await async_shelljs_1.asyncExec(`git remote -v`, { silent: true }))
        .split("\n")[0]
        .split("\t");
    const name = remote[0];
    const resource = remote[1].replace(/ .*/, "");
    const isGithub = /github/.test(resource);
    const isBitbucket = /bitbucket/.test(resource);
    const repo = resource.replace(/.*\/(.*)\.git/, "$1");
    const repoUserName = resource.replace(/.*[\/:](.*)\/.*\.git/, "$1");
    const gitServer = isGithub ? "github" : isBitbucket ? "bitbucket" : "other";
    console.log(`- Git repo already configured: ${resource}`);
    return { repo, repoUserName, gitServer };
}
async function default_1(context, validate) {
    const isRepo = await gitIsRepo(context.destinationPath());
    if (isRepo) {
        const remotes = await gitRemotes(context.destinationPath());
        context.answers = Object.assign({}, context.answers, remotes);
    }
    else {
        const git = await context.prompt([
            {
                type: "input",
                name: "repo",
                message: `${chalk_1.default.bold("Repo: ")} ${chalk_1.default.grey("what name will the GIT repo be called? ")}`,
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
            const git2 = await context.prompt([
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
            context.answers = Object.assign({}, context.answers, git2);
        }
        context.answers.repoOrigin =
            context.answers.gitServer === "bitbucket"
                ? `git@bitbucket.org:${context.answers.repoUserName}/${context.answers.repo}.git`
                : `git@github.com:${context.answers.repoUserName}/${context.answers.repo}.git`;
        context.answers.repoOriginHttp =
            context.answers.gitServer === "bitbucket"
                ? `https://bitbucket.org/${context.answers.repoUserName}/${context.answers.repo}.git`
                : `https://github.com/${context.answers.repoUserName}/${context.answers.repo}.git`;
    }
}
exports.default = default_1;
//# sourceMappingURL=git.js.map