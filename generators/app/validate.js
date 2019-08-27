"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatationFactory = answers => {
    /**
     * Validates whether the category/feature is present in the config
     *
     * @param category
     * @param feature
     */
    const has = (category, feature) => {
        const features = new Set(answers[category]);
        return features.has(feature);
    };
    return {
        isServerless: () => {
            return answers.serverless === "serverless" ? true : false;
        },
        hasTemplating: () => {
            return has("features", "typed-template");
        },
        useWallaby: () => {
            return has("features", "wallaby");
        },
        hasFirebase() {
            return has("features", "firebase");
        },
        useTravis() {
            return has("testing", "travis");
        },
        useCoveralls() {
            return has("coverage", "coveralls");
        },
        useCodecov() {
            return has("coverage", "codecov");
        },
        useStaticDocs() {
            return has("features", "vuepress");
        },
        onGithub() {
            return answers.gitServer === "github";
        },
        onBitbucket() {
            return answers.gitServer === "bitbucket";
        },
        deployableToNpm() {
            return has("features", "npm");
        },
        twitterHandleRequired() {
            return has("social", "twitter") || has("social", "twitterFollow");
        },
        gitServerURL() {
            const servers = {
                github: `https://github.com/${answers.repoUserName}`,
                bitbucket: `https://bitbucket.org/${answers.repoUserName}`,
                gitlab: `https://your-server.com/`,
                other: `https://your-server.com/`
            };
            const repoServer = answers.repoServer;
            return servers[repoServer] ? servers[repoServer] : servers.other;
        }
    };
};
//# sourceMappingURL=validate.js.map