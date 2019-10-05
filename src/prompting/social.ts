import { validatationFactory } from "../validate";
import { Answers } from "inquirer";
import chalk from "chalk";
import { kebabCase, camelCase } from "lodash";
import { IGeneratorDictionary } from "../@types";

export default async function(context: IGeneratorDictionary) {
  const social: Answers = await context.prompt([
    {
      type: "checkbox",
      name: "social",
      message: `${chalk.bold("Social: ")} ${chalk.grey(
        " social badges on README"
      )} `,
      choices: [
        {
          name: "Github forks",
          value: "forks"
        },
        {
          name: "Github stars",
          value: "stars"
        },
        {
          name: "Github watchers",
          value: "watchers"
        },
        {
          name: "Github followers",
          value: "followers"
        },
        {
          name: "Twitter",
          value: "twitter"
        },
        {
          name: "Twitter w/ follow count",
          value: "twitterFollow"
        }
      ],
      default(): string[] {
        return [];
      },
      store: true
    }
  ]);
  context.answers = { ...context.answers, ...social };
  const validate = validatationFactory(context.answers);

  if (validate.twitterHandleRequired()) {
    const twitter: Answers = await context.prompt([
      {
        type: "input",
        name: "twitterHandle",
        message: `What is the twitter handle you want to associate to this repo?`,
        store: true
      }
    ]);
    context.answers = { ...context.answers, ...twitter };
  }
}
