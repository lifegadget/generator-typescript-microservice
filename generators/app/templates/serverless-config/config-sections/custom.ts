// tslint:disable:no-invalid-template-strings
import { IServerlessAccountInfo } from './types'
// tslint:disable-next-line:no-implicit-dependencies
import { IDictionary } from 'common-types'

export const custom = (config: IServerlessAccountInfo): IServerlessCustomConfig => ({
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
  } as IServerlessCustomConfig,
})

export interface IServerlessCustomConfig extends IDictionary {
  stage?: string
  region?: string
  accountId?: string
  webpack?: any
}
