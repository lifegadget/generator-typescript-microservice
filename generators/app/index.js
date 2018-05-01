"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Base = require("yeoman-generator");
const chalk_1 = require("chalk");
const yosay = require("yosay");
const initializing_1 = require("./initializing");
const prompting_1 = require("./prompting");
const writing_1 = require("./writing");
const validate_1 = require("./validate");
function isServerless(answers) {
    return answers.serverless === "serverless" ? true : false;
}
function hasTemplating(answers) {
    return has(answers, "features", "typed-template");
}
function hasFirebase(answers) {
    return has(answers, "features", "firebase");
}
function useTravis(answers) {
    return has(answers, "testing", "travis");
}
function useBadge(name, answers) {
    return (has(answers, "testing", name) ||
        has(answers, "coverage", name) ||
        has(answers, "features", name));
}
function useNpm(answers) {
    return has(answers, "features", "npm");
}
function has(answers, category, feature) {
    const features = new Set(answers[category]);
    return features.has(feature);
}
class Generator extends Base {
    constructor(args, opts) {
        super(args, opts);
        this.answers = {};
    }
    initializing() {
        initializing_1.initializing(this)();
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            yield prompting_1.prompting(this)();
        });
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            return writing_1.writing(this, validate_1.validatationFactory(this))();
        });
    }
    install() {
        this.log("Installing Yarn dependencies ...");
        const typings = [
            "@types/aws-sdk",
            "@types/chai",
            "@types/lodash",
            "@types/mocha",
            "@types/rimraf",
            "@types/chance",
            "@types/faker",
            "@types/js-yaml"
        ];
        const globaldevDeps = [
            "async-shelljs",
            "chai",
            "chance",
            "faker",
            "handlebars",
            "inquirer",
            "lodash.first",
            "lodash.last",
            "mocha",
            "coveralls",
            "nyc",
            "prettier",
            "rimraf",
            "tslint",
            "tslint-config-prettier",
            "typescript",
            "ts-node",
            "test-console"
        ];
        const serverlessOnlyDevDeps = [
            "serverless",
            "serverless-pseudo-parameters",
            "serverless-step-functions",
            "js-yaml"
        ];
        let devDeps = [...typings, ...globaldevDeps];
        if (isServerless(this.answers)) {
            devDeps = [...devDeps, ...serverlessOnlyDevDeps];
        }
        let deps = ["common-types"];
        if (hasTemplating(this.answers)) {
            deps = [...deps, ...["typed-template"]];
        }
        if (hasFirebase(this.answers)) {
            deps = [...deps, ...["abstracted-admin", "firemodel"]];
        }
        this.spawnCommand("yarn", []);
        this.yarnInstall(devDeps, { dev: true });
        this.yarnInstall(deps);
    }
    end() {
        this.log(yosay(`\n${chalk_1.default.bold("Success!")}\nType "yarn run help" for help.`));
    }
}
module.exports = Generator;
//# sourceMappingURL=index.js.map