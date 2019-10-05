"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const initializing_1 = require("./initializing");
const prompting_1 = require("./prompting");
const install_1 = require("./install");
const writing_1 = require("./writing");
const closure_1 = require("./closure");
class Generator extends yeoman_generator_1.default {
    constructor(args, opts) {
        super(args, opts);
        this.answers = {};
    }
    async initializing() {
        initializing_1.initializing(this)();
    }
    async prompting() {
        await prompting_1.prompting(this)();
    }
    async writing() {
        return writing_1.writing(this)();
    }
    async install() {
        return install_1.install(this);
    }
    async end() {
        await closure_1.closure(this);
    }
}
module.exports = Generator;
//# sourceMappingURL=index.js.map