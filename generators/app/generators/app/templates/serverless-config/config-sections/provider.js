"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iam_1 = require("./iam");
exports.provider = (config) => ({
    provider: Object.assign({ name: 'aws', runtime: 'nodejs8.10', profile: config.profile, stage: 'dev', region: config.region, 
        // tslint:disable-next-line:no-invalid-template-strings
        environment: '${file(serverless-config/env.yml):${self:custom.stage}}' }, iam_1.iamRoleStatements(config), { aliasStage: {
            loggingLevel: 'INFO',
            dataTraceEnabled: true,
        } }),
});
//# sourceMappingURL=provider.js.map