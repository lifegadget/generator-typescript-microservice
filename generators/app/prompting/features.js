"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("../validate");
const chalk_1 = require("chalk");
function default_1(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const validate = validate_1.validatationFactory(context.answers);
        const features = yield context.prompt([
            {
                type: "checkbox",
                name: "features",
                message: `${chalk_1.default.bold("Features: ")} `,
                choices: [
                    {
                        name: `${chalk_1.default.yellow.bold("Wallaby")} configuration`,
                        value: "wallaby"
                    },
                    {
                        name: `Add ${chalk_1.default.yellow.bold("typed-template")} and directories to support for structured templating requirements`,
                        value: "typed-template"
                    },
                    {
                        name: `${chalk_1.default.bold.yellow("Firebase")} via ${chalk_1.default.bold("firemodel")} and ${chalk_1.default.bold("abstracted-admin")}`,
                        value: "firebase"
                    },
                    {
                        name: `${chalk_1.default.bold.yellow("NPM")} deployment`,
                        value: "npm"
                    }
                ],
                default: ["wallaby"],
                store: true
            }
        ]);
        context.answers = Object.assign({}, context.answers, features);
    });
}
exports.default = default_1;
//# sourceMappingURL=features.js.map