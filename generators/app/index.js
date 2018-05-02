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
const install_1 = require("./install");
const writing_1 = require("./writing");
const validate_1 = require("./validate");
const async_shelljs_1 = require("async-shelljs");
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
        return install_1.install(this);
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            const git = require("simple-git")(this.destinationPath());
            if (!async_shelljs_1.test("-d", ".git")) {
                git
                    .init()
                    .add("./*")
                    .commit("initial commit");
                this.log(`- ${chalk_1.default.bold("git")} has been initialized and files added as an initial commit 🚀`);
            }
            if (this.answers.repoOrigin) {
                git.addRemote("origin", this.answers.repoOrigin);
                this.log(`- a repo origin has been added to git of "${this.answers.repoOrigin}" ䷛`);
            }
            this.log("- git status: ", yield git.status());
            this.log(yosay(`\n${chalk_1.default.bold("Success!")}\nType "yarn run help" for help.`));
        });
    }
}
module.exports = Generator;
//# sourceMappingURL=index.js.map