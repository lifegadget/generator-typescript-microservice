"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./writing/index");
exports.writing = (context) => async () => {
    console.log("\n\nwriting files ...");
    return Promise.all([
        index_1.testResources(context)(),
        index_1.projectResources(context)(),
        index_1.buildScripts(context)(),
        index_1.configResources(context)(),
        index_1.templatingResources(context)(),
        index_1.docs(context)()
    ]);
};
exports.processFiles = (context) => (name, config) => {
    config.map(c => {
        if (typeof c === "object" &&
            c.condition !== undefined &&
            c.condition === false) {
            return;
        }
        const filename = typeof c === "string" ? c : c.file;
        const from = context.templatePath(typeof c === "object" ? c.sourceFrom || filename : filename);
        const to = context.destinationPath(filename);
        if (typeof c === "object" && c.substitute) {
            context.fs.copyTpl(from, to, c.substitute);
        }
        else {
            if (from && to) {
                console.log(`${from} => ${to}`);
                context.fs.copy(from, to);
            }
        }
    });
    context.log(`  ✔ Completed copying ${name} files`);
};
exports.addBadge = (context) => (badge) => {
    //
};
//# sourceMappingURL=writing.js.map