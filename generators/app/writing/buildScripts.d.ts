import { IDictionary } from "common-types";
import { IValidator } from "../validate";
export declare const buildScripts: (context: IDictionary<any>, validate: IValidator) => () => Promise<{}>;
