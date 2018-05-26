import { IDictionary } from "common-types";
import { IValidator, validatationFactory } from "../validate";
import { IFileConfiguration, processFiles, IGeneratorDictionary } from "../writing";

export const buildScripts = (context: IGeneratorDictionary) => () => {
  const validate = validatationFactory(context.answers);
  return new Promise(resolve => {
    const config: IFileConfiguration[] = [
      {
        file: "scripts/build.ts",
        condition: validate.isServerless(),
        sourceFrom: "scripts/build-serverless.ts"
      },
      {
        file: "scripts/build.ts",
        condition: !validate.isServerless(),
        sourceFrom: "scripts/build-library.ts"
      },
      "scripts/deploy.ts",
      "scripts/reset.ts",
      "scripts/test.ts",
      {
        file: "scripts/invoke.ts",
        condition: validate.isServerless()
      },
      {
        file: "scripts/package.ts",
        condition: validate.isServerless()
      },
      {
        file: "scripts/publish.ts",
        condition: !validate.isServerless()
      },
      "scripts/watch.ts",
      "scripts/lib/java.ts",
      "scripts/lib/js.ts",
      "scripts/lib/npm.ts",
      {
        file: "scripts/lib/serverless.ts",
        condition: validate.isServerless()
      }
    ];
    processFiles(context)("build/devops", config);
    resolve();
  });
};
