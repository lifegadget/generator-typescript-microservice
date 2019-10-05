import chalk from "chalk";
import { kebabCase, camelCase } from "lodash";
import { Answers } from "inquirer";
import { IDictionary } from "common-types";
import { validatationFactory } from "./validate";
import { git, features, social, license } from "./prompting/index";
import testing from "./prompting/testing";
import { IGeneratorDictionary } from "./@types";
import { pwd } from "async-shelljs";

function addToAnswers(source: IDictionary, addition: IDictionary) {
  source = { ...source, ...addition };
}

export const prompting = (context: IGeneratorDictionary) => async () => {
  const validate = validatationFactory(context.answers);
  const dirName = pwd()
    .split(/[\/\\]/)
    .pop();
  const appName: Answers = await context.prompt([
    {
      type: "input",
      name: "appName",
      message: "Your project name",
      default: kebabCase(context.appname) || kebabCase(dirName),
      store: true
    }
  ]);
  context.answers = appName;

  console.log("");

  await git(context, validate);

  console.log("");

  const projectType: Answers = await context.prompt([
    {
      type: "list",
      name: "serverless",
      choices: [
        { value: "serverless", name: "Serverless project using Typescript" },
        { value: "library-function", name: "Typescript Library function" }
      ],
      message: `${chalk.bold("Project Type: ")} `,
      default: "serverless",
      store: true
    }
  ]);
  context.answers = { ...context.answers, ...projectType };
  console.log("");

  await features(context);
  console.log("");

  await license(context);
  console.log("");

  await testing(context);
  await social(context);

  context.badges = {
    npm: validate.deployableToNpm() ? ["npm"] : [],
    testing: context.answers.testing,
    coverage: context.answers.coverage,
    social: context.answers.social,
    license: context.answers.license
  };
};

export default prompting;
