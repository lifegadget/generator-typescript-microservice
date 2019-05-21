// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessConfig } from 'common-types'
import { packaging, custom, plugins, provider, service, resources, IServerlessAccountInfo } from './config-sections'
import functions from './functions'
import stateMachines from './stepFunctions'

export default (accountInfo: IServerlessAccountInfo): IServerlessConfig => {
  return {
    ...service(accountInfo),
    ...packaging(accountInfo),
    ...custom(accountInfo),
    ...plugins(accountInfo),
    ...provider(accountInfo),
    ...resources(accountInfo),
    ...{ functions },
    ...{ stateMachines },
  }
}
