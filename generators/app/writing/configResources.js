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
const writing_1 = require("../writing");
const lodash_1 = require("lodash");
exports.configResources = (context) => () => {
    const validate = validate_1.validatationFactory(context.answers);
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        const npmBadge = badges(context, validate)("features");
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
                    module: validate.isServerless() ? "" : '"module": "esm/index.js",',
                    docsScripts: validate.useStaticDocs()
                        ? ',\n"docs:dev": "vuepress dev docs",\n"docs:build": "vuepress build docs"'
                        : ""
                }
            },
            {
                file: "README.md",
                substitute: {
                    appName: context.answers.appName,
                    repo: context.answers.repo,
                    repoOrigin: context.answers.repoOrigin,
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
    const badgeTemplate = "![ALT](URL) ";
    const npm = {
        npm: `https://img.shields.io/npm/v/${context.answers.repo}.svg`
    };
    const testing = {
        travis: `https://img.shields.io/travis/${context.answers.repoGroup}/${context.answers.repo}.svg`
    };
    const coverage = {
        coveralls: `https://coveralls.io/repos/${context.answers.gitServer}/${context.answers.repoUserName}/${context.answers.repo}/badge.svg?branch=master`
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
        followers: "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Follow",
        twitter: [
            `https://img.shields.io/twitter/url/http/${context.answers.twitterHandle}.svg?style=social`,
            `http://twitter.com/home?status=@${context.answers.twitterHandle} #${context.answers.repo}`
        ],
        twitterFollow: [
            `https://img.shields.io/twitter/follow/${context.answers.twitterHandle}.svg?style=social&label=Follow`,
            `https://twitter.com/intent/follow?screen_name=${context.answers.twitterHandle}`
        ]
    };
    const badgeUrls = Object.assign({}, npm, testing, coverage, licenses, social);
    let response = "";
    console.log("badges", category, context.badges[category]);
    let link;
    if (Array.isArray(context.badges[category])) {
        context.badges[category].map((badge) => {
            if (Array.isArray(badge)) {
                [badge, link] = badge;
                console.log("link", link);
            }
            const info = {
                name: badge,
                url: Array.isArray(badgeUrls[badge]) ? badgeUrls[badge][0] : badgeUrls[badge],
                link: Array.isArray(badgeUrls[badge]) ? badgeUrls[badge][1] : undefined
            };
            response += info.link
                ? `[${badgeTemplate.replace("ALT", info.name).replace("URL", info.url)}](${info.link})`
                : badgeTemplate.replace("ALT", info.name).replace("URL", info.url);
        });
    }
    else if (context.badges[category]) {
        const badge = context.badges[category];
        const info = {
            name: category,
            url: Array.isArray(badgeUrls[badge]) ? badgeUrls[badge][0] : badgeUrls[badge],
            link: Array.isArray(badgeUrls[badge]) ? badgeUrls[badge][1] : undefined
        };
        response += link
            ? `[${badgeTemplate.replace("ALT", info.name).replace("URL", info.url)}](${info.link})`
            : badgeTemplate.replace("ALT", info.name).replace("URL", info.url);
    }
    return response;
};
//# sourceMappingURL=configResources.js.map