"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const processFiles_1 = require("../processFiles");
exports.projectResources = (context) => () => {
    const validate = validate_1.validatationFactory(context.answers);
    return new Promise(resolve => {
        const serverlessConfig = [
            "src/handlers/ping.ts",
            "src/models/README.md",
            "src/shared/README.md"
        ];
        const libraryConfig = ["src/index.ts"];
        processFiles_1.processFiles(context)("project", validate.isServerless() ? serverlessConfig : libraryConfig);
        resolve();
    });
};
//# sourceMappingURL=projectResources.js.map