"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const States = {
// add your states here
};
const steps = {
    Comment: "",
    StartAt: "",
    States
};
const stateMachines = {
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
// tslint:disable-next-line:no-object-literal-type-assertion
exports.default = {};
//# sourceMappingURL=index.js.map