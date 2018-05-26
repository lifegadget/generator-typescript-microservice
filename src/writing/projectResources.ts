import { IDictionary } from "common-types";
import { IValidator, validatationFactory } from "../validate";
import { IFileConfiguration, processFiles } from "../writing";

export const projectResources = (context: IDictionary) => () => {
  const validate = validatationFactory(context.answers);

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
