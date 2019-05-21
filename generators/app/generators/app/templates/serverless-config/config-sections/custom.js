"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.custom = (config) => ({
    // tslint:disable-next-line:no-object-literal-type-assertion
    custom: {
        stage: '${opt:stage, self:provider.stage}',
        region: '${opt:region, self:provider.region}',
        accountId: config.accountId,
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: {
                forceExclude: ['aws-sdk', 'firemock', 'faker'],
            },
            packager: 'yarn',
        },
    },
});
//# sourceMappingURL=custom.js.map