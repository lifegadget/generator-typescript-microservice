import { IValidator } from "../validate";
import { IGeneratorDictionary } from "../writing";
export declare const testResources: (context: IGeneratorDictionary, validator: IValidator) => () => Promise<{}>;
