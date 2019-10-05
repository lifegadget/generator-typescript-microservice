"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const processFiles_1 = require("../processFiles");
/**
 * Adds in some basic test files along with the test helper script
 */
exports.testResources = (context) => async () => {
    const config = [
        "test/ping-spec.ts",
        "test/data/README.md",
        "test/testing/helpers.ts",
        "test/testing/test-console.ts"
    ];
    processFiles_1.processFiles(context)("test", config);
};
//# sourceMappingURL=testResources.js.map