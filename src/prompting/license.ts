import { IGeneratorDictionary } from "../writing";
import { IValidator, validatationFactory } from "../validate";
import { Answers } from "inquirer";
import chalk from "chalk";

export default async function(context: IGeneratorDictionary) {
  const validate = validatationFactory(context.answers);

  const license: Answers = await context.prompt([
    {
      type: "list",
      name: "license",
      message: `${chalk.bold("License: ")}${chalk.grey(
        "What legal license for your code "
      )} `,
      choices: ["MIT", "BSD", "Apache", "GNU", "Proprietary", "none"],
      default(): string {
        return validate.deployableToNpm() ? "MIT" : "Proprietary";
      },
      store: true
    }
  ]);
  context.answers = { ...context.answers, ...license };
}
