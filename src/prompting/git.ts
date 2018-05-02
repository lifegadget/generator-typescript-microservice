import { IDictionary } from "common-types";
import { IValidator } from "../validate";
import { Answers } from "inquirer";
import chalk from "chalk";
import { kebabCase, camelCase } from "lodash";
import { asyncExec } from "async-shelljs";

async function gitStatus(dir: string = __dirname) {
  // tslint:disable-next-line:no-submodule-imports
  const git = require("simple-git/promise")(dir);

  let statusSummary = null;
  try {
    statusSummary = await git(dir).status();
  } catch (e) {
    console.warn(`WARN: There was an issue getting git status: `, e);
  }

  return statusSummary;
}

async function gitIsRepo(dir = __dirname) {
  // tslint:disable-next-line:no-submodule-imports
  const git = require("simple-git/promise")(dir);
  const isRepo = await git.checkIsRepo();
  return isRepo;
}

async function gitRemotes(dir = __dirname) {
  const remote = (await asyncExec(`git remote -v`, { silent: true }))
    .split("\n")[0]
    .split("\t");
  const name = remote[0];
  const resource = remote[1].replace(/ .*/, "");
  const isGithub = /github/.test(resource);
  const isBitbucket = /bitbucket/.test(resource);
  const repo = resource.replace(/.*\/(.*)\.git/, "$1");
  const repoUserName = resource.replace(/.*[\/:](.*)\/.*\.git/, "$1");
  const gitServer = isGithub ? "github" : isBitbucket ? "bitbucket" : "other";
  console.log(`- Git repo already configured: ${resource}`);
  return { repo, repoUserName, gitServer };
}

export default async function(context: IDictionary, validate: IValidator) {
  const isRepo = await gitIsRepo(context.destinationPath());
  if (isRepo) {
    const remotes = await gitRemotes(context.destinationPath());
    context.answers = { ...context.answers, ...remotes };
  } else {
    const git: Answers = await context.prompt([
      {
        type: "input",
        name: "repo",
        message: `${chalk.bold("Repo: ")} ${chalk.grey(
          "what name will the GIT repo be called? "
        )}`,
        default: kebabCase(context.answers.appName),
        store: true
      },
      {
        type: "list",
        name: "gitServer",
        choices: ["github", "bitbucket", "gitlab", "other"],
        message: `${chalk.bold("Git: ")} ${chalk.grey(
          "which git server you will use? "
        )}`,
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
      context.answers = { ...context.answers, ...git2 };
    }

    context.answers.repoOrigin =
      context.answers.gitServer === "bitbucket"
        ? `git@bitbucket.org:${context.answers.repoUserName}/${context.answers.repo}.git`
        : `git@github.com:${context.answers.repoUserName}/${context.answers.repo}.git`;

    context.answers.repoOriginHttp =
      context.answers.gitServer === "bitbucket"
        ? `https://bitbucket.org/${context.answers.repoUserName}/${
            context.answers.repo
          }.git`
        : `https://github.com/${context.answers.repoUserName}/${
            context.answers.repo
          }.git`;
  }
}
