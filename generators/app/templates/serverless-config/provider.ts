// tslint:disable:no-invalid-template-strings
import { IServerlessProvider, IServerlessIAMRole } from "common-types";

const ACCOUNT_ID = "xxxxxxxxxx";
const REGION = "us-east-1";

const iamRoleStatements: IServerlessIAMRole[] = [
  {
    // PERMISSIONS FOR X-RAY TRACING
    Effect: "Allow",
    Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
    Resource: ["*"]
  },
  {
    // PERMISSIONS FOR STEP FUNCTIONS
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
];

const provider: IServerlessProvider = {
  name: "aws",
  runtime: "nodejs8.10",
  profile: "vuejs",
  stage: "prod",
  region: "us-east-1",
  environment: "${file(serverless-config/env.yml):${self:custom.stage}}",
  iamRoleStatements
};

export default provider;
