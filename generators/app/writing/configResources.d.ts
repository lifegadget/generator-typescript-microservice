import { IValidator } from "../validate";
import { IGeneratorDictionary } from "../writing";
export declare const configResources: (context: IGeneratorDictionary, validate: IValidator) => () => Promise<{}>;
