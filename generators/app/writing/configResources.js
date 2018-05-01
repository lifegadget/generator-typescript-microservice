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
const writing_1 = require("../writing");
const lodash_1 = require("lodash");
exports.configResources = (context, validate) => () => {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const npmBadge = badges(context, validate)("npm");
        const testBadges = badges(context, validate)("testing");
        const coverageBadges = badges(context, validate)("coverage");
        const licenseBadges = badges(context, validate)("license");
        const socialBadges = badges(context, validate)("social");
        const rootConfigFiles = [
            {
                file: "package.json",
                substitute: {
                    appName: lodash_1.kebabCase(context.answers.appName),
                    author: `${context.user.git.name()} <${context.user.git.email()}>`,
                    repo: `${validate.gitServerURL()}${context.answers.repoGroup}/${context.answers.repo}`,
                    keywords: context.answers.serverless
                        ? '["serverless", "typescript"]'
                        : '["typescript"]',
                    files: validate.isServerless() ? '["lib"]' : '["lib", "esm"]',
                    module: validate.isServerless() ? "" : '"module": "esm/index.js",'
                }
            },
            {
                file: "README.md",
                substitute: {
                    npmBadge,
                    testBadges,
                    coverageBadges,
                    licenseBadges,
                    socialBadges
                }
            },
            ".editorconfig",
            ".gitignore",
            ".vscode/launch.json",
            ".vscode/settings.json",
            ".vscode/tasks.json",
            ".gitignore",
            {
                file: "travis.yml",
                condition: validate.useTravis()
            }
        ];
        const serverlessConfig = [
            {
                file: "serverless.yml",
                substitute: {
                    appName: lodash_1.kebabCase(context.answers.appName)
                }
            },
            "serverless-config/env.yml",
            "serverless-config/"
        ];
        const config = validate.isServerless()
            ? [...rootConfigFiles, ...serverlessConfig]
            : rootConfigFiles;
        writing_1.processFiles(context)("configuration", config);
        resolve();
    }));
};
const badges = (context, validate) => (category) => {
    const badgeTemplate = "[![ALT](URL)]";
    const testing = {
        travis: `https://img.shields.io/travis/${context.answers.repoGroup}/${context.answers.repo}.svg`
    };
    const licenses = {
        MIT: "http://img.shields.io/badge/license-MIT-brightgreen.svg",
        BSD: "http://img.shields.io/badge/license-BSD-brightgreen.svg",
        Apache: "http://img.shields.io/badge/license-Apache-brightgreen.svg",
        GNU: "http://img.shields.io/badge/license-GNU-brightgreen.svg",
        Proprietary: "http://img.shields.io/badge/license-Proprietary-orange.svg",
        none: "http://img.shields.io/badge/license-NONE-red.svg"
    };
    const social = {
        forks: "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Fork",
        stars: "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Stars",
        watchers: "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Watch",
        followers: "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Follow"
    };
    const badgeUrls = Object.assign({}, testing, licenses, social);
    let response = "";
    console.log("badges", category, context.badges[category]);
    context.badges[category].map((badge) => {
        const info = {
            name: badge,
            url: badgeUrls[badge]
        };
        console.log("cat:", badge, info);
        response += badgeTemplate.replace("ALT", info.name).replace("URL", info.url);
    });
    return response;
};
//# sourceMappingURL=configResources.js.map