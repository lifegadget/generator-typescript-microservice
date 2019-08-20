"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const yosay = require("yosay");
async function closure(context) {
    const git = require("simple-git")(this.destinationPath());
    // if (!test("-d", ".git")) {
    //   git
    //     .init()
    //     .add("./*")
    //     .commit("initial commit");
    //   this.log(
    //     `- ${chalk.bold(
    //       "git"
    //     )} has been initialized and files added as an initial commit ðŸš€`
    //   );
    // }
    if (this.answers.repoOrigin) {
        git.addRemote("origin", this.answers.repoOrigin);
        this.log(`- a repo origin has been added to git of "${this.answers.repoOrigin}" ä·›`);
    }
    this.log(yosay(`\n${chalk_1.default.bold("Success!")}\nType "yarn run help" for help.`));
}
exports.closure = closure;
//# sourceMappingURL=closure.js.map