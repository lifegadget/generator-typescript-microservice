/// <reference types="yeoman-generator" />
import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
declare class Generator extends Base {
    constructor(args: any[], opts: any);
    options: IDictionary;
    answers: IDictionary;
    badges: IDictionary;
    initializing(): void;
    prompting(): Promise<void>;
    writing(): Promise<[{}, {}, {}, {}, {}, {}]>;
    install(): void;
    end(): void;
}
export = Generator;
