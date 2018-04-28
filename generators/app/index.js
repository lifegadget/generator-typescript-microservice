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
class Generator extends Base {
    constructor(args, opts) {
        super(args, opts);
    }
    initializing() {
        this.log(chalk_1.default.bold("Welcome to the " + chalk_1.default.green("TypeScript for Serverless") + " generator!"));
        this.log(chalk_1.default.white("- This template is primarily meant for AWS micro-services but big portions of it should apply equally well to other cloud platforms.\n" +
            "- we assume the use of YARN over NPM but if you're a fan of the NPM cli then making the necessary changes should be relatively easy.\n" +
            "- the build system leverages 'yarn run' rather than an external library like gulp, etc."));
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
                    name: "use Wallaby?",
                    message: "Include Wallaby configuration -- a real-time testing tool -- in project",
                    default: true,
                    store: true
                }
            ]);
            this.options = Object.assign({}, this.options, answers);
            this.log("options: ", this.options);
            this.config.save();
        });
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log("writing files ...");
            const testResources = () => {
                return new Promise(resolve => {
                    resolve();
                });
            };
            const projectResources = () => {
                return new Promise(resolve => {
                    resolve();
                });
            };
            const buildScripts = () => {
                return new Promise(resolve => {
                    resolve();
                });
            };
            const configResources = () => {
                return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                    const rootConfigFiles = [
                        {
                            file: "package.json",
                            substitute: {
                                appname: lodash_1.kebabCase(this.options.appName),
                                author: `${this.user.git.name()} <${this.user.git.email()}>`,
                                keywords: this.options.serverless
                                    ? '["serverless", "typescript"]'
                                    : '["typescript"]',
                                files: this.options.serverless ? '["lib"]' : '["lib", "esm"]',
                                module: this.options.serverless ? "" : '"module": "esm/index.js",\n'
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
                            condition: this.options.travis
                        }
                    ];
                    const serverlessConfig = [
                        {
                            file: "serverless.yml",
                            substitute: {
                                appname: lodash_1.kebabCase(this.options.appName)
                            }
                        },
                        "serverless-config/env.yml",
                        "serverless-config/"
                    ];
                    const config = this.options.serverless
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
        this.log(`- Copying across ${name} files`);
        config.map(c => {
            if (typeof c === "object" && c.condition !== undefined && c.condition) {
                return;
            }
            const filename = typeof c === "string" ? c : c.file;
            const from = this.templatePath(filename);
            const to = this.destinationPath(filename);
            if (typeof c === "object" && c.substitute) {
                this.log(`copying template "${from}" to "${to}"`);
                this.fs.copyTpl(from, to, c.substitute);
            }
            else {
                this.log(`copying "${from}" to "${to}"`);
                this.fs.copy(from, to);
            }
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.yarnInstall();
        });
    }
    end() {
        this.log(yosay('\nSuccess. Type "yarn run help" for help.'));
    }
}
module.exports = Generator;
