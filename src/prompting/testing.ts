import { IGeneratorDictionary } from "../@types";
import { IValidator, validatationFactory } from "../validate";
import { Answers } from "inquirer";
import chalk from "chalk";
import { kebabCase, camelCase } from "lodash";

export default async function(context: IGeneratorDictionary) {
  const validate = validatationFactory(context.answers);
  const testing: Answers = await context.prompt([
    {
      type: "checkbox",
      name: "testing",
      message: `${chalk.bold("Testing: ")} ${chalk.grey(
        "which CI solutions will you use for testing"
      )}: `,
      choices() {
        let always = [
          {
            name: "jenkins",
            value: "jenkins-tests"
          },
          {
            name: "shippable",
            value: "shippable"
          }
        ];
        const travis = {
          name: "travis",
          value: "travis"
        };
        const pipelines = {
          name: "bitbucket pipelines",
          value: "pipelines"
        };
        if (validate.onGithub()) {
          always = [...always, travis];
        }
        if (validate.onBitbucket()) {
          always = [...always, pipelines];
        }

        return always;
      },
      default(): string[] {
        return validate.onGithub() ? ["travis"] : [];
      }
    }
  ]);
  context.answers = { ...context.answers, ...testing };

  const testing2: Answers = await context.prompt([
    {
      type: "checkbox",
      name: "coverage",
      message: `${chalk.bold("Coverage")}: ${chalk.grey(
        "Which CI solutions will you use for test coverage"
      )} `,
      choices: [
        {
          name: "jenkins",
          value: "jenkins-coverage"
        },
        {
          name: "coveralls",
          value: "coveralls"
        },
        {
          name: "codecov",
          value: "codecov"
        }
      ],
      default(): string[] {
        return validate.useTravis() ? ["converalls"] : [];
      },
      store: true
    }
  ]);
  context.answers = { ...context.answers, ...testing2 };
}
