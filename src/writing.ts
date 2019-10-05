import { IDictionary } from "common-types";
import {
  configResources,
  projectResources,
  testResources,
  templatingResources,
  docs
} from "./writing/index";
import { IGeneratorDictionary } from "./@types";
import chalk from "chalk";

export const writing = (context: IGeneratorDictionary) => async () => {
  console.log(chalk`{bold \n\nWriting files ...}`);

  const results = await Promise.all([
    testResources(context)(),
    projectResources(context)(),
    configResources(context)(),
    templatingResources(context)(),
    docs(context)()
  ]);

  console.log(chalk`{bold \n\nWriting files ...}`);
};

export const addBadge = (context: IDictionary) => (badge: string) => {
  //
};
