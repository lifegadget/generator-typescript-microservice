import { validatationFactory } from "../validate";
import { IGeneratorDictionary, IFileConfiguration } from "../@types";
import { processFiles } from "../processFiles";

export const docs = (context: IGeneratorDictionary) => () => {
  const validate = validatationFactory(context.answers);
  return new Promise(resolve => {
    const config: IFileConfiguration[] = ["docs/README.md"];
    processFiles(context)(
      "static docs",
      validate.useStaticDocs() ? config : []
    );
    resolve();
  });
};
