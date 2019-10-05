import { IServerlessAccountInfo } from './types'

export const service: (config: IServerlessAccountInfo) => { service: { name: string } } = config => ({
  service: {
    name: config.name,
  },
})
