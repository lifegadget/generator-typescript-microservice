import { IDictionary } from "common-types";
import { IGeneratorDictionary } from "./@types";
export declare const writing: (context: IGeneratorDictionary) => () => Promise<void>;
export declare const addBadge: (context: IDictionary) => (badge: string) => void;
