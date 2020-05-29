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
const chalk_1 = __importDefault(require("chalk"));
const lodash_1 = require("lodash");
const async_shelljs_1 = require("async-shelljs");
function gitStatus(dir = __dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = require("simple-git/promise")(dir);
        let statusSummary = null;
        try {
            statusSummary = yield git(dir).status();
        }
        catch (e) {
            console.warn(`WARN: There was an issue getting git status: `, e);
        }
        return statusSummary;
    });
}
function gitIsRepo(dir = __dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        const git = require("simple-git/promise")(dir);
        const isRepo = yield git.checkIsRepo();
        return isRepo;
    });
}
function gitRemotes(dir = __dirname) {
    return __awaiter(this, void 0, void 0, function* () {
        const remote = (yield async_shelljs_1.asyncExec(`git remote -v`, { silent: true }))
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
    });
}
function default_1(context, validate) {
    return __awaiter(this, void 0, void 0, function* () {
        const isRepo = yield gitIsRepo(context.destinationPath());
        if (isRepo) {
            const remotes = yield gitRemotes(context.destinationPath());
            context.answers = Object.assign(Object.assign({}, context.answers), remotes);
        }
        else {
            const git = yield context.prompt([
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
            context.answers = Object.assign(Object.assign({}, context.answers), git);
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
                context.answers = Object.assign(Object.assign({}, context.answers), git2);
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
    });
}
exports.default = default_1;
//# sourceMappingURL=git.js.map