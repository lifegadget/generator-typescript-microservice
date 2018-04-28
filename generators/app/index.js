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
const lodash_1 = require("lodash");
const yosay = require("yosay");
const fs = require("fs");
const path = require("path");
function isServerless(answers) {
    return answers.serverless === "serverless" ? true : false;
}
class Generator extends Base {
    constructor(args, opts) {
        super(args, opts);
    }
    initializing() {
        const graphic = fs.readFileSync(path.join(__dirname, "../../computer.txt"), {
            encoding: "utf-8"
        });
        this.log(graphic);
        this.log(chalk_1.default.bold("\nWelcome to the " + chalk_1.default.green("TypeScript for Serverless") + " generator!\n"));
        this.log(chalk_1.default.grey(`- This template is primarily meant for ${chalk_1.default.white("AWS")} micro-services but big portions of it should apply equally well to other cloud platforms.\n` +
            `- we assume the use of ${chalk_1.default.white("YARN")} over NPM but if you're a fan of the NPM cli then making the necessary changes should be relatively easy.\n` +
            "- the build system leverages 'yarn run' rather than an external library like gulp, etc.\n\n"));
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            const answers = yield this.prompt([
                {
                    type: "input",
                    name: "appName",
                    message: "Your project name",
                    default: this.appname,
                    store: true
                },
                {
                    type: "confirm",
                    name: "wallaby",
                    message: "Include Wallaby configuration -- a real-time testing tool -- in project",
                    default: true,
                    store: true
                },
                {
                    type: "confirm",
                    name: "travis",
                    message: "Would you like to use Travis as part of CI solution?",
                    default: true,
                    store: true
                },
                {
                    type: "list",
                    name: "serverless",
                    choices: ["serverless", "library-function"],
                    message: `\n\n${chalk_1.default.bold("Project Type: ")} although the primary function of this template is to setup for a Serverless project, you can also choose here to instead build a Typescript-driven library function`,
                    default: "serverless",
                    store: true
                }
            ]);
            this.answers = answers;
        });
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("writing files ...");
            const testResources = () => {
                return new Promise(resolve => {
                    const config = [
                        "test/ping-spec.ts",
                        "test/data/README.md",
                        "test/testing/helpers.ts",
                        "test/testing/test-console.ts"
                    ];
                    this._private_processFiles("test", config);
                    resolve();
                });
            };
            const projectResources = () => {
                return new Promise(resolve => {
                    const serverlessConfig = [
                        "src/handlers/ping.ts",
                        "src/models/README.md",
                        "src/shared/README.md"
                    ];
                    const libraryConfig = ["src/index.ts"];
                    this._private_processFiles("project", isServerless(this.answers) ? serverlessConfig : libraryConfig);
                    resolve();
                });
            };
            const buildScripts = () => {
                return new Promise(resolve => {
                    const config = [
                        "scripts/build.ts",
                        "scripts/deploy.ts",
                        "scripts/test.ts",
                        {
                            file: "scripts/invoke.ts",
                            condition: isServerless(this.answers)
                        },
                        {
                            file: "scripts/package.ts",
                            condition: isServerless(this.answers)
                        },
                        {
                            file: "scripts/publish.ts",
                            condition: !isServerless(this.answers)
                        },
                        "scripts/watch.ts",
                        "scripts/lib/java.ts",
                        "scripts/lib/js.ts",
                        "scripts/lib/npm.ts",
                        {
                            file: "scripts/lib/serverless.ts",
                            condition: isServerless(this.answers)
                        }
                    ];
                    this._private_processFiles("build/devops", config);
                    resolve();
                });
            };
            const configResources = () => {
                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    const rootConfigFiles = [
                        {
                            file: "package.json",
                            substitute: {
                                appname: lodash_1.kebabCase(this.answers.appName),
                                author: `${this.user.git.name()} <${this.user.git.email()}>`,
                                keywords: this.answers.serverless
                                    ? '["serverless", "typescript"]'
                                    : '["typescript"]',
                                files: this.answers.serverless ? '["lib"]' : '["lib", "esm"]',
                                module: this.answers.serverless ? "" : '"module": "esm/index.js",'
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
                            condition: this.answers.travis
                        }
                    ];
                    const serverlessConfig = [
                        {
                            file: "serverless.yml",
                            substitute: {
                                appname: lodash_1.kebabCase(this.answers.appName)
                            }
                        },
                        "serverless-config/env.yml",
                        "serverless-config/"
                    ];
                    const config = this.answers.serverless
                        ? [...rootConfigFiles, ...serverlessConfig]
                        : rootConfigFiles;
                    this._private_processFiles("configuration", config);
                    resolve();
                }));
            };
            return Promise.all([
                testResources(),
                projectResources(),
                buildScripts(),
                configResources()
            ]);
        });
    }
    _private_processFiles(name, config) {
        config.map(c => {
            if (typeof c === "object" && c.condition !== undefined && c.condition) {
                return;
            }
            const filename = typeof c === "string" ? c : c.sourceFrom || c.file;
            const from = this.templatePath(filename);
            const to = this.destinationPath(filename);
            if (typeof c === "object" && c.substitute) {
                this.fs.copyTpl(from, to, c.substitute);
            }
            else {
                this.fs.copy(from, to);
            }
        });
        this.log(`  ✔ Completed copying ${name} files`);
    }
    install() {
        this.log("Installing Yarn dependencies ...");
        this.spawnCommand("yarn", []);
    }
    end() {
        this.log(yosay(`\n${chalk_1.default.bold("Success!")}\nType "yarn run help" for help.`));
    }
}
module.exports = Generator;
