"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./writing/index");
const chalk_1 = __importDefault(require("chalk"));
exports.writing = (context) => () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk_1.default `{bold \n\nWriting files ...}`);
    const results = yield Promise.all([
        index_1.testResources(context)(),
        index_1.projectResources(context)(),
        index_1.configResources(context)(),
        index_1.templatingResources(context)(),
        index_1.docs(context)()
    ]);
    console.log(chalk_1.default `{bold \n\nWriting files ...}`);
});
exports.addBadge = (context) => (badge) => {
    //
};
//# sourceMappingURL=writing.js.map