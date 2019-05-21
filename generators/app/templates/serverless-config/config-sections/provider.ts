// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessIAMRole, IServerlessProvider } from 'common-types'
import { IServerlessAccountInfo } from './types'
import { iamRoleStatements } from './iam'

export const provider = (config: IServerlessAccountInfo): { provider: IServerlessProvider } => ({
  provider: {
    name: 'aws',
    runtime: 'nodejs8.10',
    profile: config.profile,
    stage: 'dev',
    region: config.region,
    // tslint:disable-next-line:no-invalid-template-strings
    environment: '${file(serverless-config/env.yml):${self:custom.stage}}',
    ...iamRoleStatements(config),
    aliasStage: {
      loggingLevel: 'INFO',
      dataTraceEnabled: true,
    },
  },
})
