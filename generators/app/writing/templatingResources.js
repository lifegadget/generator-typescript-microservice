"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const writing_1 = require("../writing");
exports.templatingResources = (context, validate) => () => {
    return new Promise(resolve => {
        const templating = [
            "templates/templates/example-template/default.hbs",
            "templates/templates/example-template/email-html.hbs",
            "templates/templates/example-template/email-text.hbs",
            "templates/templates/example-template/sms.hbs",
            "templates/layouts/email-html/default.hbs",
            "templates/layouts/email-text/default.hbs",
            "templates/layouts/default.hbs",
            "templates/README.md"
        ];
        writing_1.processFiles(context)("templating", validate.hasTemplating() ? templating : []);
        resolve();
    });
};
//# sourceMappingURL=templatingResources.js.map