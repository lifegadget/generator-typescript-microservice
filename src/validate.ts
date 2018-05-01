import { IDictionary } from "common-types";

export type IValidatorFactory = (answers: IDictionary) => IValidator;

export interface IValidator {
  isServerless(): boolean;
  hasTemplating(): boolean;
  hasFirebase(): boolean;
  useTravis(): boolean;
  onGithub(): boolean;
  onBitbucket(): boolean;
  deployableToNpm(): boolean;
  twitterHandleRequired(): boolean;
  gitServerURL(): string;
}

// tslint:disable-next-line:one-variable-per-declaration
export const validatationFactory: IValidatorFactory = answers => {
  //
  const has = (category: string, feature: string): boolean => {
    const features = new Set(answers[category]);
    return features.has(feature);
  };

  return {
    isServerless: () => {
      return answers.serverless === "serverless" ? true : false;
    },

    hasTemplating: () => {
      return has("features", "typed-template");
    },

    hasFirebase() {
      return has("features", "firebase");
    },

    useTravis() {
      return has("testing", "travis");
    },

    onGithub() {
      return answers.gitServer === "github";
    },

    onBitbucket() {
      return answers.gitServer === "bitbucket";
    },

    deployableToNpm() {
      return has("features", "npm");
    },

    twitterHandleRequired() {
      return has("social", "twitter") || has("social", "twitterFollow");
    },

    gitServerURL(): string {
      const servers: IDictionary<string> = {
        github: `https://github.com/${answers.repoUserName}`,
        bitbucket: `https://bitbucket.org/${answers.repoUserName}`,
        gitlab: `https://your-server.com/`,
        other: `https://your-server.com/`
      };
      const repoServer = answers.repoServer;
      return servers[repoServer] ? servers[repoServer] : servers.other;
    }
  };
};
