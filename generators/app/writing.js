"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./writing/index");
const chalk_1 = __importDefault(require("chalk"));
exports.writing = (context) => async () => {
    console.log(chalk_1.default `{bold \n\nWriting files ...}`);
    const results = await Promise.all([
        index_1.testResources(context)(),
        index_1.projectResources(context)(),
        index_1.configResources(context)(),
        index_1.templatingResources(context)(),
        index_1.docs(context)()
    ]);
    console.log(chalk_1.default `{bold \n\nWriting files ...}`);
};
exports.addBadge = (context) => (badge) => {
    //
};
//# sourceMappingURL=writing.js.map