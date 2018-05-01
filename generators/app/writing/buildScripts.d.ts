import { IValidator } from "../validate";
import { IGeneratorDictionary } from "../writing";
export declare const buildScripts: (context: IGeneratorDictionary, validate: IValidator) => () => Promise<{}>;
