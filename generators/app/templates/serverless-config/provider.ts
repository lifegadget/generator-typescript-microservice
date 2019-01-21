// tslint:disable:no-invalid-template-strings
// tslint:disable-next-line:no-implicit-dependencies
import { IServerlessProvider, IServerlessIAMRole } from "common-types";

const ACCOUNT_ID = "xxxxxxxxxx"; // FILL THIS IN
const REGION = "us-east-1"; // FILL THIS IN

const ssmPermissions: IServerlessIAMRole = {
  Effect: "Allow",
  Action: ["ssm:GetParameter", "ssm:GetParametersByPath"],
  Resource: [`arn:aws:ssm:${REGION}*`]
};

const xRayPermissions: IServerlessIAMRole = {
  Effect: "Allow",
  Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
  Resource: ["*"]
}

const stepFunctionPermissions: IServerlessIAMRole = {
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
    `arn:aws:states:${REGION}:${ACCOUNT_ID}:stateMachine:*`,
    `arn:aws:states:${REGION}:${ACCOUNT_ID}:execution:*:*`
  ]
}

const iamRoleStatements: IServerlessIAMRole[] = [
  ssmPermissions, xRayPermissions, stepFunctionPermissions
];

const provider: IServerlessProvider = {
  name: "aws",
  runtime: "nodejs8.10",
  profile: "PROFILE",
  stage: "prod",
  region: REGION,
  environment: "${file(serverless-config/env.yml):${self:custom.stage}}",
  iamRoleStatements
};

export default provider;
