import { IDictionary } from "common-types";
import { IValidator } from "../validate";
import { IFileConfiguration, processFiles } from "../writing";

export const templatingResources = (context: IDictionary, validate: IValidator) => () => {
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
    processFiles(context)("templating", validate.hasTemplating() ? templating : []);
    resolve();
  });
};
