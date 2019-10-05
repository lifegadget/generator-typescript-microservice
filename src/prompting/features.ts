import { IGeneratorDictionary } from "../@types";
import { Answers } from "inquirer";
import chalk from "chalk";

export default async function(context: IGeneratorDictionary) {
  const features: Answers = await context.prompt([
    {
      type: "checkbox",
      name: "features",
      message: `${chalk.bold("Features: ")} `,
      choices: [
        {
          name: `${chalk.yellow.bold("Vuepress")} static documentation site`,
          value: "vuepress"
        },
        {
          name: `${chalk.yellow.bold("Wallaby")} configuration`,
          value: "wallaby"
        },
        {
          name: `Add ${chalk.yellow.bold(
            "typed-template"
          )} and directories to support for structured templating requirements`,
          value: "typed-template"
        },
        {
          name: `${chalk.bold.yellow("Firebase")} via ${chalk.bold(
            "firemodel"
          )} and ${chalk.bold("abstracted-admin")}`,
          value: "firebase"
        },

        {
          name: `${chalk.bold.yellow("NPM")} deployment`,
          value: "npm"
        }
      ],
      default: ["wallaby"],
      store: true
    }
  ]);
  context.answers = { ...context.answers, ...features };
}
