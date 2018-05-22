// tslint:disable:no-invalid-template-strings
import {
  IStepFunction,
  IStepFunctionTask,
  IStepFunctionWait,
  IStepFunctionFail,
  IStateMachine,
  IStepFunctionStep,
  IDictionary,
  IStepFunctionChoice,
  IStepFunctionPass,
  IStepFunctionSucceed,
  IStepFunctionParallel
} from "common-types";

const States: IDictionary<IStepFunctionStep> = {
  // add your states here
};

const steps: IStepFunction = {
  Comment: "",
  StartAt: "",
  States
}


const stateMachines: IDictionary<IStateMachine> = {
  nameOfStateMachine: {
    events: [
      {
        schedule: {
          rate: "rate(240 minutes)",
          enabled: true,
          input: { foo: "bar" }
        }
      }
    ],
    name: "[nameOfStateMachine]-${self:custom.stage}-steps",
    definition: steps
  }
};

export default { stateMachines };
