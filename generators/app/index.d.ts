import Base from "yeoman-generator";
import { IDictionary } from "common-types";
declare class Generator extends Base {
    constructor(args: any[], opts: any);
    options: IDictionary;
    answers: IDictionary;
    badges: IDictionary;
    initializing(): Promise<void>;
    prompting(): Promise<void>;
    writing(): Promise<void>;
    install(): Promise<void>;
    end(): Promise<void>;
}
export = Generator;
