// tslint:disable:no-invalid-template-strings
import { IServerlessProvider, IServerlessIAMRole } from "common-types";

const iamRoleStatements: IServerlessIAMRole[] = [
  {
    // PERMISSIONS FOR SNS PUBLISHING
    Effect: "Allow",
    Action: ["SNS:Publish"],
    Resource: [
      "arn:aws:sns:#{AWS::Region}:#{AWS::AccountId}:transport-${self:custom.stage}"
    ]
  },
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
      "arn:aws:states:us-east-1:#{AWS::AccountId}:stateMachine:*",
      "arn:aws:states:us-east-1:#{AWS::AccountId}:execution:*:*"
    ]
  }
];

const provider: IServerlessProvider = {
  name: "aws",
  runtime: "nodejs8.10",
  profile: "my-app",
  stage: "dev",
  region: "us-east-1",
  iamRoleStatements
};

export default provider;
