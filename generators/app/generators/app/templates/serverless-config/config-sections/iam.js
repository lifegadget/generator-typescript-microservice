"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stepFunctions_1 = require("../stepFunctions");
function iamRoleStatements(config) {
    const iam = [
        ssmPermissions(config),
        xRayPermissions(config),
        stepFunctions(config),
        invokePermissions(config),
    ].filter(i => i !== false);
    return { iamRoleStatements: iam };
}
exports.iamRoleStatements = iamRoleStatements;
function ssmPermissions(config) {
    return {
        Effect: 'Allow',
        Action: ['ssm:GetParameter', 'ssm:GetParametersByPath'],
        Resource: [`arn:aws:ssm:${config.region}*`],
    };
}
function cloudwatchLogging(config) {
    return {
        Effect: 'Allow',
        Action: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:DescribeLogGroups',
            'logs:DescribeLogStreams',
            'logs:PutLogEvents',
            'logs:GetLogEvents',
            'logs:FilterLogEvents',
        ],
        Resource: ['*'],
    };
}
function invokePermissions(config) {
    return {
        Effect: 'Allow',
        Action: ['lambda:InvokeFunction'],
        Resource: [`arn:aws:lambda:${config.region}:${config.accountId}:function:${config.name}*`],
    };
}
function xRayPermissions(config) {
    return {
        Effect: 'Allow',
        Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
        Resource: ['*'],
    };
}
function stepFunctions(config) {
    return stepFunctions_1.default && stepFunctions_1.default.stateMachines && Object.keys(stepFunctions_1.default.stateMachines).length > 0
        ? {
            Effect: 'Allow',
            Action: [
                'states:ListStateMachines',
                'states:CreateActivity',
                'states:StartExecution',
                'states:ListExecutions',
                'states:DescribeExecution',
                'states:DescribeStateMachineForExecution',
                'states:GetExecutionHistory',
            ],
            Resource: [
                `arn:aws:states:${config.region}:${config.accountId}:stateMachine:*`,
                `arn:aws:states:${config.region}:${config.accountId}:execution:*:*`,
            ],
        }
        : false;
}
//# sourceMappingURL=iam.js.map