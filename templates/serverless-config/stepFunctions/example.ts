// NOTE: the serverless plugin psuedo-variables creates "invalid template strings"
// hence the exclusion below.
// tslint:disable: no-invalid-template-strings

import { IStepFunction, IStepFunctionStep, IDictionary } from "common-types";

const doThis: IStepFunctionStep = {
  Type: "Task",
  Resource:
    "arn:aws:lambda:${self:provider.region}:${self:provider.accountId}:function:universal-services-${self:custom.stage}-doThis",
  Next: "thenDoThis",
  Catch: [
    {
      ErrorEquals: ["States.ALL"],
      ResultPath: "$.error-info",
      Next: "notifyOfError"
    }
  ]
};

const thenDoThis: IStepFunctionStep = {
  Type: "Task",
  Resource:
    "arn:aws:lambda:${self:provider.region}:${self:provider.accountId}:function:universal-services-${self:custom.stage}-thenDoThis",
  Next: "finallyFinishWith",
  Catch: [
    {
      ErrorEquals: ["States.ALL"],
      ResultPath: "$.error-info",
      Next: "notifyOfError"
    }
  ]
};

const finallyFinishWith: IStepFunctionStep = {
  Type: "Task",
  Resource:
    "arn:aws:lambda:${self:provider.region}:${self:provider.accountId}:function:universal-services-${self:custom.stage}-finallyFinishWith",
  End: true,
  Catch: [
    {
      ErrorEquals: ["States.ALL"],
      ResultPath: "$.error-info",
      Next: "notifyOfError"
    }
  ]
};

const notifyOfError: IStepFunctionStep = {
  Type: "Task",
  Resource:
    "arn:aws:lambda:${self:provider.region}:${self:provider.accountId}:function:universal-services-${self:custom.stage}-notifyOfError",
  End: true
};

const myStepFunction: IStepFunction = {
  StartAt: "doThis",
  States: {
    doThis,
    thenDoThis,
    finallyFinishWith
  }
};

export default myStepFunction;
