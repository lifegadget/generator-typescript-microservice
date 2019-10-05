import { IGeneratorDictionary, IFileConfiguration } from "../@types";
import { processFiles } from "../processFiles";

/**
 * Adds in some basic test files along with the test helper script
 */
export const testResources = (context: IGeneratorDictionary) => async () => {
  const config: IFileConfiguration[] = [
    "test/ping-spec.ts",
    "test/data/README.md",
    "test/testing/helpers.ts",
    "test/testing/test-console.ts"
  ];

  processFiles(context)("test", config);
};
