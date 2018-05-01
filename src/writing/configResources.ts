import { IDictionary } from "common-types";
import { IValidator } from "../validate";
import { IFileConfiguration, processFiles, addBadge } from "../writing";
import { kebabCase } from "lodash";

export const configResources = (context: IDictionary, validate: IValidator) => () => {
  return new Promise(async resolve => {
    const npmBadge = badges(context, validate)("npm");
    const testBadges = badges(context, validate)("testing");
    const coverageBadges = badges(context, validate)("coverage");
    const licenseBadges = badges(context, validate)("license");
    const socialBadges = badges(context, validate)("social");

    const rootConfigFiles: IFileConfiguration[] = [
      {
        file: "package.json",
        substitute: {
          appName: kebabCase(context.answers.appName),
          author: `${context.user.git.name()} <${context.user.git.email()}>`,
          repo: `${validate.gitServerURL()}${context.answers.repoGroup}/${
            context.answers.repo
          }`,
          keywords: context.answers.serverless
            ? '["serverless", "typescript"]'
            : '["typescript"]',
          files: validate.isServerless() ? '["lib"]' : '["lib", "esm"]',
          module: validate.isServerless() ? "" : '"module": "esm/index.js",'
        }
      },
      {
        file: "README.md",
        substitute: {
          npmBadge,
          testBadges,
          coverageBadges,
          licenseBadges,
          socialBadges
        }
      },
      ".editorconfig",
      ".gitignore",
      ".vscode/launch.json",
      ".vscode/settings.json",
      ".vscode/tasks.json",
      ".gitignore",
      {
        file: "travis.yml",
        condition: validate.useTravis()
      }
    ];

    const serverlessConfig: IFileConfiguration[] = [
      {
        file: "serverless.yml",
        substitute: {
          appName: kebabCase(context.answers.appName)
        }
      },
      "serverless-config/env.yml",
      "serverless-config/"
    ];

    const config = validate.isServerless()
      ? [...rootConfigFiles, ...serverlessConfig]
      : rootConfigFiles;

    processFiles(context)("configuration", config);
    resolve();
  });
};

const badges = (context: IDictionary, validate: IValidator) => (
  category: string
): string => {
  const badgeTemplate = "[![ALT](URL)]";
  const testing = {
    travis: `https://img.shields.io/travis/${context.answers.repoGroup}/${
      context.answers.repo
    }.svg`
  };
  const licenses = {
    MIT: "http://img.shields.io/badge/license-MIT-brightgreen.svg",
    BSD: "http://img.shields.io/badge/license-BSD-brightgreen.svg",
    Apache: "http://img.shields.io/badge/license-Apache-brightgreen.svg",
    GNU: "http://img.shields.io/badge/license-GNU-brightgreen.svg",
    Proprietary: "http://img.shields.io/badge/license-Proprietary-orange.svg",
    none: "http://img.shields.io/badge/license-NONE-red.svg"
  };
  const social = {
    forks:
      "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Fork",
    stars:
      "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Stars",
    watchers:
      "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Watch",
    followers:
      "https://img.shields.io/github/forks/badges/shields.svg?style=social&label=Follow"
  };
  const badgeUrls: IDictionary = {
    ...testing,
    ...licenses,
    ...social
  };
  let response = "";
  console.log("badges", category, context.badges[category]);

  context.badges[category].map((badge: string) => {
    const info = {
      name: badge,
      url: badgeUrls[badge]
    };
    console.log("cat:", badge, info);
    response += badgeTemplate.replace("ALT", info.name).replace("URL", info.url);
  });
  return response;
};
