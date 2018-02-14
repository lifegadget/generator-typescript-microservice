// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec, ls, cat } from "async-shelljs";
import { uniq } from "lodash";
import * as program from "commander";
import { IDictionary } from "common-types";
import * as inquirer from "inquirer";
import * as fs from "fs";
import * as yaml from "js-yaml";

const pkg = JSON.parse(cat("./package.json"));

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
  let nodeModules: any = ls("-d", "node_modules/*")
    .map(nm => nm.replace("node_modules/", ""))
    .filter(f => (program.keepTypes ? true : !f.match(/@types/) && f !== undefined));
  const removeAtTypes = f => (program.keepTypes ? true : !f.match(/@types/));
  const atDeps = nodeModules
    .filter(f => f[0] === "@")
    .filter(removeAtTypes)
    .map(nm => nm.replace("node_modules/", ""));
  const typingDeps = ls("-d", "node_modules/@types/*").map(nm =>
    nm.replace("node_modules/", "")
  );
  atDeps.forEach(dep => {
    const extra = ls("-d", `node_modules/${dep}/*`).map(nm =>
      nm.replace("node_modules/", "")
    );
    nodeModules = nodeModules.filter(nm => nm !== dep).concat(extra);
  });

  if (program.functions || program.all) {
    if (!program.json) {
      console.log(
        chalk.white(
          `- There are ${chalk.yellow.bold(
            String(nodeModules.length)
          )} directories in your ${chalk.whiteBright.bold(
            "node_modules"
          )} directory including those under ${atDeps.join(", ")}`
        )
      );
      if (!program.keepTypes) {
        console.log(
          chalk.grey(
            `- Note that @types/XYZ dependencies [${
              typingDeps.length
            } in this project] are all ignored as they should never be a dependency to JS`
          )
        );
      }
    }
  }

  return Promise.resolve({ nodeModules, typingDeps });
}

export async function depAnalysis(data: IDeps): Promise<IDictionary> {
  let relationships = {};
  const dependencies = new Set(data.dependencies);
  const hasAnalysis =
    ls(".").filter(f => f === "dep-analysis.json").length > 0 ? true : false;
  const answer = await inquirer.prompt({
    name: "userStoredAnalysis",
    message: "Use the stored analysis (dep-analysis.json)?",
    type: "confirm",
    default: true,
    when: () => hasAnalysis
  });
  const errors = [];
  if (answer.userStoredAnalysis) {
    relationships = JSON.parse(
      fs.readFileSync("./dep-analysis.json", { encoding: "utf-8" })
    );
  } else {
    process.stdout.write("- Starting analysis of deps in node_modules:\n");
    const blockSize = 30;
    for (let index = 0; index < data.nodeModules.length; index = index + blockSize) {
      process.stdout.write("⌛ ");
      const promises = [];
      let firstResponder = true;
      for (let offset = 0; offset < blockSize - 1; offset++) {
        const nm = data.nodeModules[index + offset];
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
  const dependencyGraph = {};
  const singleNamedDepInDep = [];
  const singleNamedDepNotInDep = [];
  const multiDepNotInTopLevelDep = [];
  const multiDepInTopLevelDep = [];

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
    const deps = relationships[key];
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
  if (noDeps.length > 0) {
    console.log(chalk.dim.grey(noDeps.join(", ")));
  }
  console.log(
    `- There were ${chalk.yellow(
      String(onlyDevDep.length)
    )} modules with ${chalk.italic.bold.green(
      "only"
    )} a top-level project development dependency on them (aka, not required): `
  );
  console.log(chalk.grey.dim(onlyDevDep.join(", ")));

  console.log(
    `- There were ${chalk.yellow(
      String(singleNamedDep.length)
    )} modules which had only a single named dependency, ${chalk.yellow(
      String(singleNamedDepNotInDep.length)
    )} have no dependency on top-level "dependencies" of the project: `
  );
  process.stdout.write(chalk.dim.red(singleNamedDepInDep.join(", ")));
  process.stdout.write(chalk.dim.grey(", " + singleNamedDepNotInDep.join(", ") + "\n"));

  console.log(
    `- There were ${chalk.yellow(
      String(multiDep.length)
    )} modules which had multiple named dependencies, ${chalk.yellow(
      String(multiDepNotInTopLevelDep.length)
    )} had no dependency on top-level "dependencies" of the project: `
  );
  process.stdout.write(chalk.dim.red(multiDepInTopLevelDep.join(", ")));
  process.stdout.write(chalk.dim.grey(", " + multiDepNotInTopLevelDep.join(", ") + "\n"));

  // console.log(dependencyGraph);

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

export async function getYarnWhy(dep: string, dependencies, errors: IDictionary[]) {
  let why;
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
  dependencies,
  errors: IDictionary[]
): string[] {
  const singleNamedDep = data.match(/This module exists because/gm);
  const multiDep = data.match(/Reasons this module exists/gm);
  if (singleNamedDep) {
    const [devnull, depInfo] = /.*This module exists because (.*)(\n.*)/g.exec(data);
    const namedDep = depInfo.replace(/.*\"(.*)\".*/g, "$1").replace(/\#.*/, "");
    // console.log(`${depInfo} => ${namedDep}`);

    return data.match(/in /)
      ? depInfo.match(/"dependencies"/) ? ["in dependencies"] : ["in devDependencies"]
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

async function buildGlobalExcludeFile(results: IDeps) {
  console.log(chalk.bold(`\n- building a global exclude file for serverless config\n`));

  const answer = await inquirer.prompt([
    {
      name: "onlyDevDep",
      message: "Exclude top-level devDeps?",
      type: "confirm",
      default: true
    },
    {
      name: "singleNamedDepNotInDep",
      message:
        "Exclude all modules with single dependencies which do not have top-level dependencies?",
      type: "confirm",
      default: true
    },
    {
      name: "multiDepNotInTopLevelDep",
      message:
        "Exclude all modules with multiple dependencies which do not have top-level dependencies?",
      type: "confirm",
      default: true
    },
    {
      name: "format",
      message: "What format should the output file be?",
      type: "list",
      choices: ["json", "yaml"],
      default: "json"
    }
  ]);
  const filename = "exclude-by-default." + answer.format;
  process.stdout.write(
    chalk.bold(`\n- writing serverless config (${chalk.grey(filename)}) `)
  );
  let data: any = [];
  if (answer.onlyDevDep) {
    data = data.concat(results.analysis.onlyDevDep);
    console.log("data", data.length);
  }
  if (answer.singleNamedDepNotInDep) {
    data = data.concat(results.analysis.singleNamedDepNotInDep);
    console.log("data", data.length);
  }
  if (answer.doesNotIncludeDev) {
    data = data.concat(results.analysis.multiDepNotInTopLevelDep);
    console.log("data", data.length);
  }

  data = data.map(dep => `node_modules/${dep}/**`);

  data =
    answer.format === "json"
      ? JSON.stringify(data)
      : yaml.dump({ package: { exclude: data } });

  fs.writeFileSync(filename, data, { encoding: "utf-8" });
  process.stdout.write("... done!\n\n");
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
  .option("--excludeFile", "generate a global exclude file for the serverless config")
  .option("-v", "more verbose output")
  .option("--json", "output as JSON object instead of console output")
  .description(
    "Get a summary of the dependencies that exist globally and per serverless function"
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
    if (program.excludeFile) {
      await buildGlobalExcludeFile(results);
    }
    results = { ...(await functionsList()), ...results };

    if (program.json) {
      console.log(JSON.stringify(results, null, 2));
    }
  })

  .parse(process.argv);
