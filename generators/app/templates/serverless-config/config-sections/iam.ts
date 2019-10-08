import { IServerlessIAMRole, IServerlessAccountInfo } from "common-types";
import stateMachines from "../stepFunctions";

export function iamRoleStatements(
  config: IServerlessAccountInfo
): { iamRoleStatements: IServerlessIAMRole[] } {
  const iam = [
    ssmPermissions(config),
    xRayPermissions(config),
    stepFunctions(config),
    invokePermissions(config)
  ].filter(i => i !== false);
  return { iamRoleStatements: iam as IServerlessIAMRole[] };
}

function ssmPermissions(
  config: IServerlessAccountInfo
): IServerlessIAMRole | false {
  return {
    Effect: "Allow",
    Action: ["ssm:GetParameter", "ssm:GetParametersByPath"],
    Resource: [`arn:aws:ssm:${config.region}*`]
  };
}

function cloudwatchLogging(
  config: IServerlessAccountInfo
): IServerlessIAMRole | false {
  return {
    Effect: "Allow",
    Action: [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams",
      "logs:PutLogEvents",
      "logs:GetLogEvents",
      "logs:FilterLogEvents"
    ],
    Resource: ["*"]
  };
}

function invokePermissions(
  config: IServerlessAccountInfo
): IServerlessIAMRole | false {
  return {
    Effect: "Allow",
    Action: ["lambda:InvokeFunction"],
    Resource: [
      `arn:aws:lambda:${config.region}:${config.accountId}:function:${config.name}*`
    ]
  };
}

function xRayPermissions(
  config: IServerlessAccountInfo
): IServerlessIAMRole | false {
  return {
    Effect: "Allow",
    Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
    Resource: ["*"]
  };
}

function stepFunctions(
  config: IServerlessAccountInfo
): IServerlessIAMRole | false {
  return stateMachines.stateMachines &&
    Object.keys(stateMachines.stateMachines).length > 0
    ? {
        Effect: "Allow",
        Action: [
          "states:ListStateMachines",
          "states:CreateActivity",
          "states:StartExecution",
          "states:ListExecutions",
          "states:DescribeExecution",
          "states:DescribeStateMachineForExecution",
          "states:GetExecutionHistory"
        ],
        Resource: [
          `arn:aws:states:${config.region}:${config.accountId}:stateMachine:*`,
          `arn:aws:states:${config.region}:${config.accountId}:execution:*:*`
        ]
      }
    : false;
}
