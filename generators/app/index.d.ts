/// <reference types="yeoman-generator" />
import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
declare class Generator extends Base {
    constructor(args: any[], opts: any);
    options: IDictionary;
    answers: IDictionary;
    initializing(): void;
    prompting(): Promise<void>;
    writing(): Promise<[{}, {}, {}, {}, {}]>;
    private _private_addBadge(type);
    private _private_processFiles(name, config);
    install(): void;
    end(): void;
}
export = Generator;
