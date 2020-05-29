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
exports.Generator = void 0;
const yeoman_generator_1 = __importDefault(require("yeoman-generator"));
const initializing_1 = require("./initializing");
const prompting_1 = require("./prompting");
const install_1 = require("./install");
const writing_1 = require("./writing");
const closure_1 = require("./closure");
class Generator extends yeoman_generator_1.default {
    constructor(args, opts) {
        super(args, opts);
        this.answers = {};
    }
    initializing() {
        return __awaiter(this, void 0, void 0, function* () {
            initializing_1.initializing(this)();
        });
    }
    prompting() {
        return __awaiter(this, void 0, void 0, function* () {
            yield prompting_1.prompting(this)();
        });
    }
    writing() {
        return __awaiter(this, void 0, void 0, function* () {
            return writing_1.writing(this)();
        });
    }
    install() {
        return __awaiter(this, void 0, void 0, function* () {
            return install_1.install(this);
        });
    }
    end() {
        return __awaiter(this, void 0, void 0, function* () {
            yield closure_1.closure(this);
        });
    }
}
exports.Generator = Generator;
//# sourceMappingURL=index.js.map