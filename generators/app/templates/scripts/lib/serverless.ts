// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec, ls, cat, find } from "async-shelljs";
import { uniq } from "lodash";
import * as program from "commander";
import { IDictionary, IPackageJson } from "common-types";
import * as inquirer from "inquirer";
import * as fs from "fs";
import * as yaml from "js-yaml";

export const CONFIG_DIRECTORY = "serverless-config";
export const STATIC_DEPENDENCIES_FILE = `${CONFIG_DIRECTORY}/.dep-config/static-dependencies.yml`;
export const SERVERLESS_EXCLUDE_INCLUDE_FILE = `${CONFIG_DIRECTORY}/.dep-config/serverless-exclusions-and-inclusions.json`;
export const DEP_ANALYSIS_FILE = `${CONFIG_DIRECTORY}/.dep-config/dep-analysis.json`;
const QUESTIONS_MEMORY_1 = `${CONFIG_DIRECTORY}/.dep-questions/1_memory.json`;
const QUESTIONS_MEMORY_2 = `${CONFIG_DIRECTORY}/.dep-questions/2_memory.json`;
const pkg: IPackageJson = JSON.parse(cat("./package.json"));

interface IAnalysis {
  singleNamedDepInDep: string[];
  singleNamedDepNotInDep: string[];
  multiDepInTopLevelDep: string[];
  multiDepNotInTopLevelDep: string[];
  noDeps: string[];
  /** modules with only multiple dependencies */
  multiDep: string[];
  /** modules with only a single dependency */
  singleNamedDep: string[];
  /** The given module ONLY has one dependency and it's in devDeps not Deps */
  onlyDevDep: string[];
}
export interface IDeps {
  dependencies?: string[];
  devDependencies?: string[];
  nodeModules?: string[];
  typingDeps?: string[];
  functions?: IDictionary;
  unrelatedToDeps?: string[];
  analysis?: IAnalysis;
}

export async function depsList(): Promise<IDictionary> {
  if (program.functions || program.all) {
    if (!program.json) {
      console.log(
        chalk.white(
          `- There are ${chalk.bold.yellow(
            String(Object.keys(pkg.dependencies).length)
          )} development dependencies in this project`
        )
      );
    }

    return { dependencies: Object.keys(pkg.dependencies) };
  }

  return {};
}

export async function devDepsList(): Promise<IDictionary> {
  if (program.functions || program.all) {
    if (!program.json) {
      console.log(
        chalk.white(
          `- There are ${chalk.bold.yellow(
            String(Object.keys(pkg.devDependencies).length)
          )} development dependencies in this project`
        )
      );
    }

    return { devDependencies: Object.keys(pkg.devDependencies) };
  }

  return {};
}

export async function functionsList() {
  return {};
}

export async function nodeModulesDirectories() {
  const nodeModules: any = ls("-d", "node_modules/*")
    .map(nm => nm.replace("node_modules/", ""))
    .filter(f => f[0] !== "@"); // remove all @ from modules but will handle when building excludes

  if (program.functions || program.all) {
    if (!program.json) {
      console.log(
        chalk.white(
          `- There are ${chalk.yellow.bold(
            String(nodeModules.length)
          )} directories in your ${chalk.whiteBright.bold("node_modules")}`
        )
      );
    }
  }

  return Promise.resolve({ nodeModules });
}

export async function depAnalysis(data: IDeps): Promise<IDictionary> {
  let relationships: IDictionary = {};
  const dependencies = new Set(data.dependencies);
  const hasAnalysis = fs.existsSync(DEP_ANALYSIS_FILE);
  const answer: any = await inquirer.prompt({
    name: "userStoredAnalysis",
    message: "Use the stored analysis (dep-analysis.json)?",
    type: "confirm",
    default: true,
    when: () => hasAnalysis
  });
  const errors: any[] = [];
  if (answer.userStoredAnalysis) {
    relationships = JSON.parse(fs.readFileSync(DEP_ANALYSIS_FILE, { encoding: "utf-8" }));
  } else {
    console.log(`- Didn't find existing analysis file at: ${DEP_ANALYSIS_FILE}`);

    process.stdout.write("- Starting analysis of deps in node_modules:\n");
    const blockSize = 30;
    for (let index = 0; index < data.nodeModules.length; index = index + blockSize) {
      process.stdout.write("⌛ ");
      const promises = [];
      let firstResponder = true;
      for (let offset = 0; offset < blockSize - 1; offset++) {
        const nm = data.nodeModules[index + offset];
        if (nm !== "undefined" && nm) {
          promises.push(
            getYarnWhy(nm, dependencies, errors).then(why => {
              if (firstResponder) {
                firstResponder = false;
                process.stdout.write("\b\b");
              }
              if (why.length > 0) {
                process.stdout.write(` .`);
              } else {
                process.stdout.write(chalk.grey.dim(" ."));
              }
              relationships[nm] = why;
            })
          );
        }
      }
      await Promise.all(promises);
    }
    console.log(chalk.white.bold("\n- 🚀  Dependency analysis complete "));
    fs.writeFileSync("./dep-analysis.json", JSON.stringify(relationships));
    console.log(
      chalk.grey(
        `-   The complete analysis has been saved to the "dep-analysis.json" file\n`
      )
    );
  }

  if (errors.length > 0) {
    console.log(
      chalk.red(
        `- There were errors evaluating the depencencies: `,
        JSON.stringify(errors)
      )
    );
  }
  let noDeps: string[] = [];
  const onlyDevDep: string[] = [];
  const multiDep: string[] = [];
  const singleNamedDep: string[] = [];
  const dependencyGraph: IDictionary = {};
  const singleNamedDepInDep: any[] = [];
  const singleNamedDepNotInDep: any[] = [];
  const multiDepNotInTopLevelDep: any[] = [];
  const multiDepInTopLevelDep: any[] = [];

  Object.keys(relationships).map(key => {
    if (relationships[key].length === 0) {
      noDeps.push(key);
    }
    // SINGLE
    if (relationships[key].length === 1) {
      if (relationships[key][0] === "in devDependencies") {
        // top-level declared devDep
        onlyDevDep.push(key);
      } else {
        singleNamedDep.push(key);
        const isDependency =
          dependencies.has(relationships[key][0]) ||
          relationships[key][0] === "in dependencies";
        if (isDependency) {
          singleNamedDepInDep.push(key);
          if (dependencyGraph[key]) {
            dependencyGraph[key].push(relationships[key][0]);
          } else {
            dependencyGraph[key] = [relationships[key][0]];
          }
        } else {
          // named devDep that's not at top project level
          singleNamedDepNotInDep.push(key);
        }
      }
    } // MULTI
    if (relationships[key].length > 1) {
      multiDep.push(key);
    }
  });
  multiDep.forEach(key => {
    const deps: any[] = relationships[key];
    if (deps.every(d => !dependencies.has(d) && d !== "in dependencies")) {
      multiDepNotInTopLevelDep.push(key);
    } else {
      multiDepInTopLevelDep.push(key);
      if (dependencyGraph[key]) {
        dependencyGraph[key].push(relationships[key]);
      } else {
        dependencyGraph[key] = [relationships[key]];
      }
    }
  });

  noDeps = noDeps.filter(f => f !== "undefined");
  console.log(`\nAnalysis Summary ${chalk.bgWhiteBright(" 📊  ")}`);
  console.log("---------------------");

  console.log(
    `- There were ${chalk.yellow(String(noDeps.length))} modules with NO dependencies`
  );
  const show: IDictionary = await inquirer.prompt([
    {
      name: "details",
      message: "show details?",
      type: "confirm",
      default: false,
      when: noDeps.length > 0
    }
  ]);
  if (show.details) {
    console.log(chalk.dim.grey(noDeps.join(", ")));
  }
  console.log(
    `- There were ${chalk.yellow(
      String(onlyDevDep.length)
    )} modules with ${chalk.italic.bold.green(
      "only"
    )} a top-level project development dependency on them (aka, not required): `
  );
  const show1: IDictionary = await inquirer.prompt([
    {
      name: "details",
      message: "show details?",
      type: "confirm",
      default: false,
      when: onlyDevDep.length > 0
    }
  ]);
  if (show1.details) {
    console.log(chalk.grey.dim(onlyDevDep.join(", ")));
  }

  console.log(
    `- There were ${chalk.yellow(
      String(singleNamedDep.length)
    )} modules which had only a single named dependency, ${chalk.yellow(
      String(singleNamedDepNotInDep.length)
    )} have no dependency on top-level "dependencies" of the project: `
  );
  const show2: IDictionary = await inquirer.prompt([
    {
      name: "details",
      message: "show details?",
      type: "confirm",
      default: false,
      when: singleNamedDepInDep.length + singleNamedDepNotInDep.length > 0
    }
  ]);
  if (show2.details) {
    process.stdout.write(chalk.dim.red(singleNamedDepInDep.join(", ")));
    process.stdout.write(chalk.dim.grey(", " + singleNamedDepNotInDep.join(", ") + "\n"));
  }

  console.log(
    `- There were ${chalk.yellow(
      String(multiDep.length)
    )} modules which had multiple named dependencies, ${chalk.yellow(
      String(multiDepNotInTopLevelDep.length)
    )} had no dependency on top-level "dependencies" of the project: `
  );
  const show3: IDictionary = await inquirer.prompt([
    {
      name: "details",
      message: "show details?",
      type: "confirm",
      default: false,
      when: multiDepInTopLevelDep.length > 0
    }
  ]);
  if (show3.details) {
    process.stdout.write(chalk.dim.red(multiDepInTopLevelDep.join(", ")));
    process.stdout.write(
      chalk.dim.grey(", " + multiDepNotInTopLevelDep.join(", ") + "\n")
    );
  }

  const analysis: IAnalysis = {
    singleNamedDepInDep,
    singleNamedDepNotInDep,
    multiDepInTopLevelDep,
    multiDepNotInTopLevelDep,
    noDeps,
    multiDep,
    singleNamedDep,
    onlyDevDep
  };
  return { relationships, analysis };
}

export async function getYarnWhy(dep: string, dependencies: any, errors: IDictionary[]) {
  let why: any;
  try {
    const yarn = await asyncExec(`yarn why ${dep} 2> /dev/null`, { silent: true });
    why = extractWhy(dep, yarn, dependencies, errors);
  } catch (e) {
    errors.push({ module: dep, error: e });
    why = [];
  }

  return why;
}

/**
 * Pulls out a list of dependencies where the response is either a string of
 * "dependencies" or "devDependencies" or an array of modules which depend on
 * it.
 *
 * @param data output from yarn's "why" request
 */
function extractWhy(
  moduleName: string,
  data: string,
  dependencies: any,
  errors: IDictionary[]
): string[] {
  const singleNamedDep = data.match(/This module exists because/gm);
  const multiDep = data.match(/Reasons this module exists/gm);
  if (singleNamedDep) {
    const [devnull, depInfo] = /.*This module exists because (.*)(\n.*)/g.exec(data);
    const namedDep = depInfo.replace(/.*\"(.*)\".*/g, "$1").replace(/\#.*/, "");

    return data.match(/in /)
      ? depInfo.match(/"dependencies"/)
        ? ["in dependencies"]
        : ["in devDependencies"]
      : [namedDep];
  } else if (multiDep) {
    const deps = uniq(
      data
        .replace(/.*Reasons this module exists\n(.*)info Disk/g, "$1")
        .split("\n")
        .filter(i => i.match(/\s+\- /))
        .map(i => i.trim())
        .map(i => {
          if (i.match("- Specified")) {
            return i.replace(/.* in "(.*)"/, "in $1");
          } else if (i.match('- "')) {
            return i.replace(/- "(.*)".*/, "$1").replace(/#.*/, "");
          } else {
            errors.push({
              module: moduleName,
              error: "Yarn response didn't fit know response pattern"
            });
            return undefined;
          }
        })
        .filter(f => f !== undefined)
    );
    return deps;
  } else {
    errors.push({
      module: moduleName,
      error: `Unknown yarn response format for ${moduleName}`
    });
  }
  return [];
}

interface IStaticDependencies {
  include?: string[];
  exclude?: string[];
}

interface IServerlessConfig {
  service?: string;
  package: {
    individually?: boolean;
    excludeDevDependencies?: boolean;
    browser?: boolean;
    include?: string[];
    exclude?: string[];
  };
}

async function buildGlobalExcludeFile(results: IDeps) {
  console.log(chalk.bold(`\n- building a global exclude file for serverless config\n`));
  const atTypes = ls("-d", "node_modules/*")
    .map(d => d.replace("node_modules/", ""))
    .filter(d => d[0] === "@");
  const isModule = (thingy: any) => !thingy.match(/\[/);
  let submoduleExclusions = 0;
  let staticDependencies: IStaticDependencies;
  let excludeCount: number;
  try {
    staticDependencies = yaml.safeLoad(
      fs.readFileSync(STATIC_DEPENDENCIES_FILE, { encoding: "utf-8" })
    );
    excludeCount = staticDependencies.exclude.length;
  } catch (e) {
    console.log(
      `\n- The "${STATIC_DEPENDENCIES_FILE}" file didn't exist. This is fine and we will move forward with no static inclusions or exclusions.\n`
    );

    staticDependencies = {};
    excludeCount = 0;
  }
  let memory: IDictionary;
  try {
    memory = JSON.parse(fs.readFileSync(QUESTIONS_MEMORY_1, { encoding: "utf-8" }));
    if (Object.keys(memory).length === 0) {
      memory = undefined;
    }
  } catch (e) {
    memory = undefined;
  }

  const answer: any = await inquirer.prompt([
    {
      name: "onlyDevDep",
      message: `Exclude top-level devDeps? [ ${
        results.analysis.onlyDevDep.length
      } modules ]`,
      type: "confirm",
      default: memory ? memory.singleNamedDepNotInDep : true
    },
    {
      name: "singleNamedDepNotInDep",
      message: `Exclude all modules with single dependencies which do not have top-level dependencies? [${
        results.analysis.singleNamedDepNotInDep.length
      } modules]`,
      type: "confirm",
      default: memory ? memory.singleNamedDepNotInDep : true
    },
    {
      name: "multiDepNotInTopLevelDep",
      message: `Exclude all modules with multiple dependencies which do not have top-level dependencies? [${
        results.analysis.multiDepNotInTopLevelDep.length
      } modules]`,
      type: "confirm",
      default: memory ? memory.multiDepNotInTopLevelDep : true
    },
    {
      name: "atDependencies",
      message:
        "The modules under node_modules/@xxx (e.g., @types) are almost always just Typescript typing; choose which to remove",
      type: "checkbox",
      choices: atTypes,
      default: memory ? memory.atDependencies : ["@types", "@serverless"]
    },
    {
      name: "staticDependencies",
      message: `You have an '${STATIC_DEPENDENCIES_FILE}' file with ${chalk.bold(
        String(excludeCount)
      )} exclusions. Should we add this?`,
      type: "confirm",
      when: staticDependencies.exclude ? true : false,
      default: memory ? memory.staticDependencies : true
    }
  ]);
  fs.writeFileSync(QUESTIONS_MEMORY_1, JSON.stringify(answer), { encoding: "utf-8" });

  console.log(
    `\nWhen library authors do not specify "files" in their package.json you get a lot of junk, the next few questions are ways in which we might be able to carve out some of this dead-code.\n`
  );

  const excluded: any[] = [];
  if (answer.onlyDevDep) {
    excluded.push(...results.analysis.onlyDevDep);
  }
  if (answer.singleNamedDepNotInDep) {
    excluded.push(...results.analysis.singleNamedDepNotInDep);
  }
  if (answer.doesNotIncludeDev) {
    excluded.push(...results.analysis.multiDepNotInTopLevelDep);
  }
  if (answer.staticDependencies) {
    const fileTypes = staticDependencies.exclude.filter(mod => !isModule(mod));
    excluded.push(...staticDependencies.exclude);
    submoduleExclusions = submoduleExclusions + fileTypes.length;
  }
  const remainingModules: any[] = results.nodeModules.filter(m => {
    return !excluded.includes(m);
  });

  const recursiveNodeModules = remainingModules.filter(m => {
    try {
      fs.statSync(`node_modules/${m}/node_modules`);
      return true;
    } catch (e) {
      return false;
    }
  });

  const testDirs = remainingModules.filter(m => {
    try {
      fs.statSync(`node_modules/${m}/test`);
      return true;
    } catch (e) {
      return false;
    }
  });

  const testsDirs = remainingModules.filter(m => {
    try {
      fs.statSync(`node_modules/${m}/tests`);
      return true;
    } catch (e) {
      return false;
    }
  });

  const docDirs = remainingModules.filter(m => {
    try {
      fs.statSync(`node_modules/${m}/documentation`);
      return true;
    } catch (e) {
      try {
        fs.statSync(`node_modules/${m}/docs`);
        return false;
      } catch (e) {
        return false;
      }
    }
  });

  const srcDirs = remainingModules
    .filter(m => {
      try {
        fs.statSync(`node_modules/${m}/src`);
        return true;
      } catch (e) {
        return false;
      }
    })
    .filter(m => {
      return pkg.main.match(/src/);
    });

  let memory2: IDictionary;
  try {
    memory2 = JSON.parse(fs.readFileSync(QUESTIONS_MEMORY_2, { encoding: "utf-8" }));
  } catch (e) {
    memory2 = undefined;
  }
  const answer2: any = await inquirer.prompt([
    {
      name: "nodeModules",
      message: `Some library authors don't exclude "node_modules" in ".gitignore" and these directories\n  can be quite full of junk. There are ${chalk.yellow(
        String(recursiveNodeModules.length)
      )} cases of that within the remaining modules not excluded.\n  There are rare cases where this is actually a real requirement but if it's just a one-off you can add\n  to the ${STATIC_DEPENDENCIES_FILE} file.\n\n  Remove?`,
      type: "confirm",
      default: memory2 ? memory2.nodeModules : true
    },
    {
      name: "docs",
      message: `There are ${
        docDirs.length
      } that have a "docs" or "documentation" directory, should we remove?`,
      type: "confirm",
      default: memory2 ? memory2.docs : true,
      when: docDirs.length > 0
    },
    {
      name: "tests",
      message: `There are ${
        testDirs.length
      } that have a "test" or "tests" directory, should we remove?`,
      type: "confirm",
      default: memory2 ? memory2.tests : true,
      when: testDirs.length > 0
    },
    {
      name: "src",
      message: `The "src" directories are often still hanging around unnecessarily. In this case there are ${chalk.yellow(
        String(srcDirs.length)
      )} modules that have a "src" directory (and who's package.json's main does not point to the src dir), should we remove?`,
      type: "confirm",
      default: memory2 ? memory2.src : false,
      when: srcDirs.length > 0
    }
  ]);
  fs.writeFileSync(QUESTIONS_MEMORY_2, JSON.stringify(answer2), { encoding: "utf-8" });

  const filename = SERVERLESS_EXCLUDE_INCLUDE_FILE;
  process.stdout.write(
    chalk.bold(
      `\n- writing serverless config (${chalk.grey(SERVERLESS_EXCLUDE_INCLUDE_FILE)}) `
    )
  );
  let data: string[] = [];
  if (answer.onlyDevDep) {
    data = data.concat(results.analysis.onlyDevDep);
  }
  if (answer.singleNamedDepNotInDep) {
    data = data.concat(results.analysis.singleNamedDepNotInDep);
  }
  if (answer.doesNotIncludeDev) {
    data = data.concat(results.analysis.multiDepNotInTopLevelDep);
  }
  if (answer.atDependencies) {
    answer.atDependencies.forEach((type: any) => {
      data = data.concat(type);
    });
  }
  if (answer.staticDependencies) {
    data = data.concat(...staticDependencies.exclude);
  }
  if (answer2.nodeModules) {
    const add = recursiveNodeModules.map(m => `${m}/node_modules`);
    data = data.concat(...add);
    submoduleExclusions = submoduleExclusions + add.length;
  }
  if (answer2.src) {
    const add = srcDirs.map(m => `${m}/src`);
    data = data.concat(...add);
    submoduleExclusions = submoduleExclusions + add.length;
  }
  if (answer2.tests) {
    const test = testDirs.map(m => `${m}/test`);
    const tests = testsDirs.map(m => `${m}/tests`);
    data = data.concat(...test, ...tests);
    submoduleExclusions = submoduleExclusions + test.length + tests.length;
  }

  // console.log(`INCLUDE`, staticDependencies.include);

  data = uniq(
    data
      .filter(
        d => (staticDependencies.include ? !staticDependencies.include.includes(d) : true)
      )
      .map(
        d =>
          isModule(d) ? `node_modules/${d}/**` : `${d.replace("[", "").replace("]", "")}`
      )
  );
  // Always exclude the possible "package" directory
  data = data.concat("serverless-package/**");
  // WRITE FILE
  fs.writeFileSync(SERVERLESS_EXCLUDE_INCLUDE_FILE, JSON.stringify(data), {
    encoding: "utf-8"
  });

  console.log(
    `There are now ${chalk.bold.green(
      String(data.length - submoduleExclusions)
    )} exclusions out of a total of ${chalk.yellow(
      String(results.nodeModules.length)
    )} modules residing in node_modules.`
  );

  if (submoduleExclusions > 0) {
    console.log(
      chalk.grey(`- there were also ${submoduleExclusions} sub-module exclusions`)
    );
  }
}

if (process.argv.slice(2).filter(i => i[0] !== "-").length === 0) {
  process.argv.push("all");
}

program
  .option("-a, --all", "provide all outputs")
  .option(
    "-f, --functions",
    "provide the serverless functions defined in serverless config"
  )
  .option("--skip", "skips writing output to file")
  .option("-v", "more verbose output")
  .option("--json", "output as JSON object instead of console output")
  .description(
    "Get a summary of the dependencies that exist globally and per serverless function and then create global and per-function exclusions"
  )
  .action(async () => {
    const args = process.argv.slice(2).filter(a => a[0] !== "-");
    let results: IDeps = {};
    if (args[0] === "all") {
      program.all = true;
    }

    results = await depsList();
    results = { ...(await devDepsList()), ...results };
    results = { ...(await nodeModulesDirectories()), ...results };
    results = { ...(await depAnalysis(results)), ...results };
    if (!program.skip) {
      await buildGlobalExcludeFile(results);
    }
    results = { ...(await functionsList()), ...results };

    if (program.json) {
      console.log(JSON.stringify(results, null, 2));
    }
  })

  .parse(process.argv);
