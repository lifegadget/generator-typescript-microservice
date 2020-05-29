"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRemote = exports.checkIsRepo = exports.initializeRepo = void 0;
const util_1 = require("util");
function initializeRepo(context) {
    const git = require("simple-git")(context.destinationPath());
    return util_1.promisify(git.init);
}
exports.initializeRepo = initializeRepo;
function checkIsRepo(context) {
    const git = require("simple-git")(context.destinationPath());
    return util_1.promisify(git.checkIsRepo);
}
exports.checkIsRepo = checkIsRepo;
function addRemote(context) {
    const git = require("simple-git")(context.destinationPath());
    return util_1.promisify(git.addRemote);
}
exports.addRemote = addRemote;
//# sourceMappingURL=git.js.map