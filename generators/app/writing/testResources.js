"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const processFiles_1 = require("../processFiles");
/**
 * Adds in some basic test files along with the test helper script
 */
exports.testResources = (context) => () => __awaiter(void 0, void 0, void 0, function* () {
    const config = [
        "test/ping-spec.ts",
        "test/data/README.md",
        "test/testing/helpers.ts",
        "test/testing/test-console.ts"
    ];
    processFiles_1.processFiles(context)("test", config);
});
//# sourceMappingURL=testResources.js.map