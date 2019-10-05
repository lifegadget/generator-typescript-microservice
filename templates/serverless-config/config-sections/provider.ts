import { IServerlessIAMRole, IServerlessProvider } from 'common-types'
import { IServerlessAccountInfo } from './types'
import { iamRoleStatements } from './iam'

export const provider = (config: IServerlessAccountInfo): { provider: IServerlessProvider } => ({
  provider: {
    name: 'aws',
    runtime: 'nodejs10.x',
    profile: config.profile,
    stage: 'dev',
    region: config.region,
    logRetentionInDays: 5,
    environment: '${file(serverless-config/env.yml):${self:custom.stage}}',
    ...iamRoleStatements(config),
    aliasStage: {
      loggingLevel: 'INFO',
      dataTraceEnabled: true,
    },
  },
})
