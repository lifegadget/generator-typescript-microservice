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
        const license = yield context.prompt([
            {
                type: "list",
                name: "license",
                message: `${chalk_1.default.bold("License: ")}${chalk_1.default.grey("What legal license for your code ")} `,
                choices: ["MIT", "BSD", "Apache", "GNU", "Proprietary", "none"],
                default() {
                    return validate.deployableToNpm() ? "MIT" : "Proprietary";
                },
                store: true
            }
        ]);
        context.answers = Object.assign({}, context.answers, license);
    });
}
exports.default = default_1;
//# sourceMappingURL=license.js.map