import { IGeneratorDictionary } from "../@types";
export declare function initializeRepo(context: IGeneratorDictionary): () => Promise<void>;
export declare function checkIsRepo(context: IGeneratorDictionary): () => Promise<boolean>;
export declare function addRemote(context: IGeneratorDictionary): (name: string, repo: string) => Promise<void>;
