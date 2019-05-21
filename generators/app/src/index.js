"use strict";
const Base = require("yeoman-generator");
const chalk_1 = require("chalk");
const yosay = require("yosay");
const initializing_1 = require("./initializing");
const prompting_1 = require("./prompting");
const install_1 = require("./install");
const writing_1 = require("./writing");
const async_shelljs_1 = require("async-shelljs");
class Generator extends Base {
    constructor(args, opts) {
        super(args, opts);
        this.answers = {};
    }
    initializing() {
        initializing_1.initializing(this)();
    }
    async prompting() {
        await prompting_1.prompting(this)();
    }
    async writing() {
        return writing_1.writing(this)();
    }
    install() {
        return install_1.install(this);
    }
    async end() {
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
        this.log(yosay(`\n${chalk_1.default.bold("Success!")}\nType "yarn run help" for help.`));
    }
}
module.exports = Generator;
//# sourceMappingURL=index.js.map