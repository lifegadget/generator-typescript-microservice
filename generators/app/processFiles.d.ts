import { IGeneratorDictionary, IFileConfiguration } from "./@types";
/**
 * Copy's the input
 *
 * @param context the Generator object plus answers to all questions
 */
export declare const processFiles: (context: IGeneratorDictionary) => (name: string, files: IFileConfiguration[]) => void;
