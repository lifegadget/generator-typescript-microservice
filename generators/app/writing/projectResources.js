"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writing_1 = require("../writing");
exports.projectResources = (context, validate) => () => {
    return new Promise(resolve => {
        const serverlessConfig = [
            "src/handlers/ping.ts",
            "src/models/README.md",
            "src/shared/README.md"
        ];
        const libraryConfig = ["src/index.ts"];
        writing_1.processFiles(context)("project", validate.isServerless() ? serverlessConfig : libraryConfig);
        resolve();
    });
};
//# sourceMappingURL=projectResources.js.map