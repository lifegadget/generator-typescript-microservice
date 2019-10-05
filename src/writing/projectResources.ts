import { IDictionary } from "common-types";
import { validatationFactory } from "../validate";
import { IFileConfiguration, IGeneratorDictionary } from "../@types";
import { processFiles } from "../processFiles";

export const projectResources = (context: IGeneratorDictionary) => async () => {
  const validate = validatationFactory(context.answers);

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
};
