"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugins = (config) => {
    return {
        plugins: [
            'serverless-pseudo-parameters',
            'serverless-step-functions',
            'serverless-offline',
            'serverless-webpack',
        ],
    };
};
//# sourceMappingURL=plugins.js.map