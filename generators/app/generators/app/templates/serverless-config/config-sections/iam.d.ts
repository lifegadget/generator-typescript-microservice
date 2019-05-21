import { IServerlessIAMRole } from 'common-types';
import { IServerlessAccountInfo } from './types';
export declare function iamRoleStatements(config: IServerlessAccountInfo): {
    iamRoleStatements: IServerlessIAMRole[];
};
