import { IDictionary } from "common-types";
import { IValidator } from "../validate";
import { Answers } from "inquirer";
import chalk from "chalk";
import { kebabCase, camelCase } from "lodash";

export default async function(context: IDictionary, validate: IValidator) {
  const git: Answers = await context.prompt([
    {
      type: "input",
      name: "repo",
      message: `${chalk.bold("Repo: ")} ${chalk.grey(
        "what name will the GIT repo have? "
      )}`,
      default: kebabCase(context.answers.appName),
      store: true
    },
    {
      type: "list",
      name: "gitServer",
      choices: ["github", "bitbucket", "gitlab", "other"],
      message: `${chalk.bold("Git: ")} ${chalk.grey("which git server you will use? ")}`,
      default: "github",
      store: true
    }
  ]);
  context.answers = { ...context.answers, ...git };

  if (new Set(["bitbucket", "github"]).has(context.answers.gitServer)) {
    const git2: Answers = await context.prompt([
      {
        type: "input",
        name: "repoUserName",
        message: `${chalk.bold("Git Username: ")} ${chalk.grey(
          "what is the username or group/org this repo is owned by? "
        )}`,
        default:
          context.user.git
            .name()
            .slice(0, 1)
            .toUpperCase() + camelCase(context.user.git.name().slice(1)),
        store: true
      }
    ]);

    git2.repoOrigin =
      context.answers.gitServer === "bitbucket"
        ? `git@bitbucket.org:${git2.repoUserName}/${context.answers.repo}.git`
        : `git@github.com:${git2.repoUserName}/${context.answers.repo}.git`;

    context.log("origin: ", git2.repoOrigin);

    context.answers = { ...context.answers, ...git2 };
  }
}
