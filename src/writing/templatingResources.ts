import { IDictionary } from "common-types";
import { IValidator, validatationFactory } from "../validate";
import { IGeneratorDictionary, IFileConfiguration } from "../@types";
import { processFiles } from "../processFiles";

export const templatingResources = (context: IGeneratorDictionary) => () => {
  const validate = validatationFactory(context.answers);
  return new Promise(resolve => {
    const templating: IFileConfiguration[] = [
      "templates/templates/example-template/default.hbs",
      "templates/templates/example-template/email-html.hbs",
      "templates/templates/example-template/email-text.hbs",
      "templates/templates/example-template/sms.hbs",
      "templates/layouts/email-html/default.hbs",
      "templates/layouts/email-text/default.hbs",
      "templates/layouts/default.hbs",
      "templates/README.md"
    ];
    processFiles(context)(
      "templating",
      validate.hasTemplating() ? templating : []
    );
    resolve();
  });
};
