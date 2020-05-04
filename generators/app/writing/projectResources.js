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
const validate_1 = require("../validate");
const processFiles_1 = require("../processFiles");
exports.projectResources = (context) => () => __awaiter(void 0, void 0, void 0, function* () {
    const validate = validate_1.validatationFactory(context.answers);
    const serverlessConfig = [
        "src/handlers/example/*",
        "src/models/README.md",
        "src/shared/README.md"
    ];
    const libraryConfig = ["src/index.ts"];
    processFiles_1.processFiles(context)("project", validate.isServerless() ? serverlessConfig : libraryConfig);
});
//# sourceMappingURL=projectResources.js.map