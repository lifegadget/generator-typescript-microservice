"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const writing_1 = require("../writing");
exports.testResources = (context) => () => {
    const validate = validate_1.validatationFactory(context.answers);
    return new Promise(resolve => {
        const config = [
            "test/ping-spec.ts",
            "test/data/README.md",
            "test/testing/helpers.ts",
            "test/testing/test-console.ts"
        ];
        writing_1.processFiles(context)("test", config);
        resolve();
    });
};
//# sourceMappingURL=testResources.js.map