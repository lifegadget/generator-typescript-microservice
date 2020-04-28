"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.badges = (context, validate) => (category) => {
    const badgeTemplate = "![ALT](URL) ";
    const npm = {
        npm: `https://img.shields.io/npm/v/${context.answers.repo}.svg`
    };
    const testing = {
        travis: `https://img.shields.io/travis/${context.answers.repoUserName}/${context.answers.repo}.svg`
    };
    const coverage = {
        coveralls: [
            `https://coveralls.io/repos/${context.answers.gitServer}/${context.answers.repoUserName}/${context.answers.repo}/badge.svg?branch=master`,
            `https://coveralls.io/${context.answers.gitServer}/${context.answers.repoUserName}/${context.answers.repo}`
        ],
        codecov: [
            `https://codecov.io/gh/${context.answers.repoUserName}/${context.answers.repo}/branch/master/graph/badge.svg`,
            `https://codecov.io/${context.answers.gitServer === "github" ? "gh" : "bb"}/${context.answers.repoUserName}/${context.answers.repo}`
        ]
    };
    const licenses = {
        MIT: [
            "http://img.shields.io/badge/license-MIT-brightgreen.svg",
            "https://opensource.org/licenses/MIT"
        ],
        BSD: "http://img.shields.io/badge/license-BSD-brightgreen.svg",
        Apache: [
            "http://img.shields.io/badge/license-Apache-brightgreen.svg",
            "https://opensource.org/licenses/Apache-2.0"
        ],
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
    const badgeUrls = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, npm), testing), coverage), licenses), social);
    let response = "";
    let link;
    if (Array.isArray(context.badges[category])) {
        context.badges[category].map((badge) => {
            if (Array.isArray(badge)) {
                [badge, link] = badge;
            }
            const info = {
                name: badge,
                url: Array.isArray(badgeUrls[badge])
                    ? badgeUrls[badge][0]
                    : badgeUrls[badge],
                link: Array.isArray(badgeUrls[badge]) ? badgeUrls[badge][1] : undefined
            };
            response += info.link
                ? `[${badgeTemplate
                    .replace("ALT", info.name)
                    .replace("URL", info.url)}](${info.link})`
                : badgeTemplate.replace("ALT", info.name).replace("URL", info.url);
        });
    }
    else if (context.badges[category]) {
        const badge = context.badges[category];
        const info = {
            name: category,
            url: Array.isArray(badgeUrls[badge])
                ? badgeUrls[badge][0]
                : badgeUrls[badge],
            link: Array.isArray(badgeUrls[badge]) ? badgeUrls[badge][1] : undefined
        };
        response += link
            ? `[${badgeTemplate
                .replace("ALT", info.name)
                .replace("URL", info.url)}](${info.link})`
            : badgeTemplate.replace("ALT", info.name).replace("URL", info.url);
    }
    return response;
};
//# sourceMappingURL=badges.js.map