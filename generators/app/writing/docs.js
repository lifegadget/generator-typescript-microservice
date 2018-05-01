"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const writing_1 = require("../writing");
exports.docs = (context) => () => {
    const validate = validate_1.validatationFactory(context.answers);
    return new Promise(resolve => {
        const config = ["docs/README.md"];
        writing_1.processFiles(context)("static docs", validate.useStaticDocs() ? config : []);
        resolve();
    });
};
//# sourceMappingURL=docs.js.map