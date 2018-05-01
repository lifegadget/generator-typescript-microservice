import { IDictionary } from "common-types";
import { kebabCase } from "lodash";
import { validatationFactory, IValidator } from "./validate";
import {
  configResources,
  projectResources,
  testResources,
  templatingResources,
  buildScripts
} from "./writing/index";

export interface IComplexFileConfiguration {
  file: string;
  condition?: boolean;
  substitute?: IDictionary;
  /** allows you to state a source filename which is distinct from the output file name */
  sourceFrom?: string;
}
export type IFileConfiguration = IComplexFileConfiguration | string;

export const writing = (context: IDictionary, validate: IValidator) => async () => {
  context.log("\n\nwriting files ...");

  return Promise.all([
    testResources(context, validate)(),
    projectResources(context, validate)(),
    buildScripts(context, validate)(),
    configResources(context, validate)(),
    templatingResources(context, validate)()
  ]);
};

export const processFiles = (context: IDictionary) => (
  name: string,
  config: IFileConfiguration[]
) => {
  config.map(c => {
    if (typeof c === "object" && c.condition !== undefined && c.condition) {
      return;
    }
    const filename = typeof c === "string" ? c : c.sourceFrom || c.file;
    const from = context.templatePath(filename);
    const to = context.destinationPath(filename);

    if (typeof c === "object" && c.substitute) {
      context.fs.copyTpl(from, to, c.substitute);
    } else {
      context.fs.copy(from, to);
    }
  });
  context.log(`  ✔ Completed copying ${name} files`);
};

export const addBadge = (context: IDictionary) => (badge: string) => {
  //
};
