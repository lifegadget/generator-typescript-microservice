import { IDictionary } from "common-types";
import { IValidator, validatationFactory } from "../validate";
import { IFileConfiguration, processFiles, IGeneratorDictionary } from "../writing";

export const testResources = (context: IGeneratorDictionary) => () => {
  const validate = validatationFactory(context.answers);
  return new Promise(resolve => {
    const config: IFileConfiguration[] = [
      "test/ping-spec.ts",
      "test/data/README.md",
      "test/testing/helpers.ts",
      "test/testing/test-console.ts"
    ];
    processFiles(context)("test", config);
    resolve();
  });
};
