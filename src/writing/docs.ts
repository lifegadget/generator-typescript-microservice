import { IDictionary } from "common-types";
import { IValidator, validatationFactory } from "../validate";
import { IFileConfiguration, processFiles, IGeneratorDictionary } from "../writing";

export const docs = (context: IGeneratorDictionary) => () => {
  const validate = validatationFactory(context.answers);
  return new Promise(resolve => {
    const config: IFileConfiguration[] = ["docs/README.md"];
    processFiles(context)("static docs", validate.useStaticDocs() ? config : []);
    resolve();
  });
};
