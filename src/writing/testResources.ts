import { IDictionary } from "common-types";
import { IValidator } from "../validate";
import { IFileConfiguration, processFiles } from "../writing";

export const testResources = (context: IDictionary, validator: IValidator) => () => {
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
