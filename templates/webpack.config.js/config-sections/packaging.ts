import {
  IServerlessPackage,
  IServerlessAccountInfo,
  IPackageJson
} from "common-types";
import { readFileSync } from "fs";
import { join } from "path";

export const packaging: (
  config: IServerlessAccountInfo
) => { package: IServerlessPackage } = config => {
  const devDeps = Object.keys(
    (JSON.parse(
      readFileSync(join(process.cwd(), "package.json"), { encoding: "utf-8" })
    ) as IPackageJson).devDependencies
  );

  if (devDeps.includes("webpack") && !devDeps.includes("serverless-webpack")) {
    return { package: webpackConfig };
  } else if (devDeps.includes("serverless-webpack")) {
    return { package: serverlessWebpackConfig };
  } else {
    return { package: defaultConfig };
  }
};

/**
 * Used when `do-devops` is managing **Webpack** for us
 */
const webpackConfig: IServerlessPackage = {
  /** not needed because node_modules deps have been rolled in */
  excludeDevDependencies: false,
  /**
   * the only file we need is the handler function; at the
   * global level we're just reducing down to the set of .webpack files
   */
  exclude: [],
  include: [".webpack/**"]
};

/**
 * Used when the `serverless-webpack` plugin is managing **Webpack**
 */
const serverlessWebpackConfig: IServerlessPackage = {
  /** not needed because node_modules deps have been rolled in */
  excludeDevDependencies: true,
  /** the only file we need is the handler function */
  exclude: [".git/**", ".serverless/**", "src/**", "test/**"]
};

/**
 * The default config used if **Webpack** tree-shaking is not engaged
 */
const defaultConfig: IServerlessPackage = {
  excludeDevDependencies: true,
  exclude: [".git/**", ".serverless/**", "test/**"]
};
