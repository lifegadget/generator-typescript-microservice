"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const writing_1 = require("../writing");
exports.buildScripts = (context) => () => {
    const validate = validate_1.validatationFactory(context.answers);
    return new Promise(resolve => {
        const config = [
            {
                file: "scripts/build.ts",
                condition: validate.isServerless(),
                sourceFrom: "scripts/build-serverless.ts"
            },
            {
                file: "scripts/build.ts",
                condition: !validate.isServerless(),
                sourceFrom: "scripts/build-library.ts"
            },
            "scripts/deploy.ts",
            "scripts/reset.ts",
            "scripts/test.ts",
            {
                file: "scripts/invoke.ts",
                condition: validate.isServerless()
            },
            {
                file: "scripts/package.ts",
                condition: validate.isServerless()
            },
            {
                file: "scripts/publish.ts",
                condition: !validate.isServerless()
            },
            "scripts/watch.ts",
            "scripts/lib/java.ts",
            "scripts/lib/js.ts",
            "scripts/lib/npm.ts",
            {
                file: "scripts/lib/serverless.ts",
                condition: validate.isServerless()
            }
        ];
        writing_1.processFiles(context)("build/devops", config);
        resolve();
    });
};
//# sourceMappingURL=buildScripts.js.map