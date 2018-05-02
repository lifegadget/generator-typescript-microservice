"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./writing/index");
exports.writing = (context, validate) => () => __awaiter(this, void 0, void 0, function* () {
    context.log("\n\nwriting files ...");
    return Promise.all([
        index_1.testResources(context, validate)(),
        index_1.projectResources(context, validate)(),
        index_1.buildScripts(context, validate)(),
        index_1.configResources(context)(),
        index_1.templatingResources(context, validate)(),
        index_1.docs(context)()
    ]);
});
exports.processFiles = (context) => (name, config) => {
    config.map(c => {
        if (typeof c === "object" && c.condition !== undefined && c.condition === false) {
            return;
        }
        const filename = typeof c === "string" ? c : c.sourceFrom || c.file;
        const from = context.templatePath(filename);
        const to = context.destinationPath(filename);
        if (typeof c === "object" && c.substitute) {
            context.fs.copyTpl(from, to, c.substitute);
        }
        else {
            context.fs.copy(from, to);
        }
    });
    context.log(`  ✔ Completed copying ${name} files`);
};
exports.addBadge = (context) => (badge) => {
};
//# sourceMappingURL=writing.js.map