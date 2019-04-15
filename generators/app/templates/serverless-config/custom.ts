const custom = {
  stage: "${opt:stage, self:provider.stage}",
  region: "${opt:region, self:provider.region}",
  webpack: {
    webpackConfig: './webpack.config.js',
    includeModules: {
      forceExclude: ['aws-sdk', 'firemock', 'faker'],
    },
    packager: 'yarn',
  },
}

export default custom;
