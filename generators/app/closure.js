"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const yosay = require("yosay");
const promise_1 = __importDefault(require("simple-git/promise"));
async function closure(context) {
    const git = promise_1.default(context.destinationPath());
    try {
        const checkIsRepo = await git.checkIsRepo();
        if (checkIsRepo) {
            console.log(chalk_1.default `{grey - This project is already setup as a git repo; doing nothing more}`);
        }
        else {
            console.log(chalk_1.default `{grey - this project has {italic not yet} been setup as a git repository}`);
            await git.init();
            console.log(chalk_1.default `- This project has been registered as a {bold git} project`);
            if (context.answers.repoOrigin) {
                await git.addRemote("origin", context.answers.repoOrigin);
                console.log(chalk_1.default `- added "remote" for git repo: {italic grey ${context.answers.repoOrigin}}`);
            }
        }
    }
    catch (e) {
        console.log(`- attempts to setup git for you failed but that's our fault`);
        console.log(`- error message was: ${e.message}`);
        console.log(`\n{grey ${e.stack}\n`);
        console.log(chalk_1.default `- anyway, outside of the {bold git} fumble, all else is well :)`);
    }
    console.log(yosay(`\n${chalk_1.default.bold("Success!")}\nType "yarn run help" for help.`));
}
exports.closure = closure;
//# sourceMappingURL=closure.js.map