import { IStateMachine, IDictionary } from "common-types";
// import doSomething from './example'

const stateMachines: IDictionary<IStateMachine> = {
  /**
   * add your step-functions here ... typically you will just import
   * a step-function per file (aka, a `state-machine`) above
   * where the file exports (as a default export)
   *
   */
};

export default {
  stateMachines
} as IDictionary;
