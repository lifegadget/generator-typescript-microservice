import { IDictionary } from "common-types";
import { IValidator, validatationFactory } from "../validate";
import { Answers } from "inquirer";
import chalk from "chalk";
import { kebabCase, camelCase } from "lodash";

export default async function(context: IDictionary) {
  const validate = validatationFactory(context.answers);
  const badging: Answers = await context.prompt([
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
    },
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
        return [];
      }
    },
    {
      type: "list",
      name: "license",
      message: `${chalk.bold("License: ")}${chalk.grey(
        "What legal license for your code "
      )} `,
      choices: ["MIT", "BSD", "Apache", "GNU", "Proprietary", "none"],
      default(): string {
        return validate.deployableToNpm() ? "MIT" : "Proprietary";
      }
    },
    {
      type: "checkbox",
      name: "social",
      message: `${chalk.bold("Social: ")} ${chalk.grey(" social badges on README")} `,
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
          value: "twitter-follow"
        }
      ],
      default(): string[] {
        return [];
      }
    }
  ]);
  context.answers = { ...context.answers, ...badging };
}
