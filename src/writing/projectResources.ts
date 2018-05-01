import { IDictionary } from "common-types";
import { IValidator } from "../validate";
import { IFileConfiguration, processFiles } from "../writing";

export const projectResources = (context: IDictionary, validate: IValidator) => () => {
  return new Promise(resolve => {
    const serverlessConfig: IFileConfiguration[] = [
      "src/handlers/ping.ts",
      "src/models/README.md",
      "src/shared/README.md"
    ];
    const libraryConfig: IFileConfiguration[] = ["src/index.ts"];
    processFiles(context)(
      "project",
      validate.isServerless() ? serverlessConfig : libraryConfig
    );
    resolve();
  });
};
