import { IServerlessAccountInfo } from './types';
import { IDictionary } from 'common-types';
export declare const custom: (config: IServerlessAccountInfo) => IServerlessCustomConfig;
export interface IServerlessCustomConfig extends IDictionary {
    stage?: string;
    region?: string;
    accountId?: string;
    webpack?: any;
}
