// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessBindDeploymentIdPlugin, createBindDeploymentConfig, IServerlessStage } from 'common-types'
import { IServerlessAccountInfo } from './types'
import { plugins } from './plugins'

/**
 * **resources**
 *
 * Defines the `resources` property in the serverless configuration which is meant as a means
 * to define other non-core AWS resources.
 */
export function resources(accountInfo: IServerlessAccountInfo) {
  const config: IServerlessBindDeploymentIdPlugin = createBindDeploymentConfig({
    service: accountInfo.name,
    stage: (process.env.NODE_ENV as IServerlessStage) || 'dev',
  })
  const pluginsUsed = plugins(accountInfo).plugins
  const usingDeploymentIdPlugin = pluginsUsed.includes('serverless-plugin-bind-deployment-id')
  const apiGatewayLogging = usingDeploymentIdPlugin ? config : {}

  return { ...apiGatewayLogging, ...config }
}
