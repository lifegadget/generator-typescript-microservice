"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const processFiles_1 = require("../processFiles");
exports.docs = (context) => () => {
    const validate = validate_1.validatationFactory(context.answers);
    return new Promise(resolve => {
        const config = ["docs/README.md"];
        processFiles_1.processFiles(context)("static docs", validate.useStaticDocs() ? config : []);
        resolve();
    });
};
//# sourceMappingURL=docs.js.map