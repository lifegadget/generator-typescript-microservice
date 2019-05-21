"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_1 = require("./lib/serverless");
const chalk_1 = require("chalk");
(async () => {
    const fns = await serverless_1.getFunctions();
    Object.keys(fns).map((key) => {
        console.log(`${chalk_1.default.bold(key)} [ ${chalk_1.default.grey(String(fns[key].memorySize) + "mb, " + String(fns[key].timeout) + "s")} ] : ${chalk_1.default.italic(fns[key].description)} ${chalk_1.default.reset(" ")}`);
    });
})();
//# sourceMappingURL=fns.js.map