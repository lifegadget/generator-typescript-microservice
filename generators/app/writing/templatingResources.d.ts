import { IValidator } from "../validate";
import { IGeneratorDictionary } from "../writing";
export declare const templatingResources: (context: IGeneratorDictionary, validate: IValidator) => () => Promise<{}>;
