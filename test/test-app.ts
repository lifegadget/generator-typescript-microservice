// tslint:disable:no-implicit-dependencies
import path = require("path");
import { run } from "yeoman-test";
import * as chai from "chai";
import "../types/chaiFiles";
import { ls } from "async-shelljs";
// tslint:disable-next-line:no-var-requires
const chaiFiles = require("chai-files");
chai.use(chaiFiles);

const expect = chai.expect;
const file = chaiFiles.file;
const dir = chaiFiles.dir;

describe("generate project", () => {
  this.timeout = 5000;
  // let tmp: string;
  before(async () => {
    return new Promise(resolve => {
      run(path.join(__dirname, "../generators/app"))
        .withOptions({
          skipInstall: true
        })
        .withPrompts({
          serverless: true,
          walaby: true
        })
        .inDir(path.join(__dirname, "test-output"), () => {
          console.log("callback reached");

          const base = path.join(__dirname, "test-output/*");
          console.log(`dir [${base}]:`, ls(JSON.stringify(base)));
          resolve();
        });
    });
  });

  it("creates necessary files", async () => {
    const base = path.join(__dirname, "test-output") + "/";
    // console.log(`dir [${base}]:`, ls().map((a: any) => Object.keys(a)));

    expect(file(".vscode/launch.json")).to.exist;
    expect(file(".vscode/tasks.json")).to.exist;
    expect(file(".vscode/settings.json")).to.exist;

    expect(file("scripts/build.ts")).to.exist;
    expect(file("scripts/deploy.ts")).to.exist;
    expect(file("scripts/invoke.ts")).to.exist;
    expect(file("scripts/publish.ts")).to.exist;
    expect(file("scripts/test.ts")).to.exist;

    expect(file("serverless.yml")).to.exist;
    expect(file("serverless-config/provider.ts")).to.exist;
    expect(file("serverless-config/env.yml")).to.exist;
    expect(file("serverless-config/functions/index.ts")).to.exist;
    expect(file("serverless-config/stepFunctions/index.ts")).to.exist;

    expect(dir("test")).to.exist;
    expect(dir("test/testing")).to.exist;
    expect(dir("test/data")).to.exist;

    // assert.file([
    //   ".vscode/tasks.json",
    //   ".vscode/settings.json",
    //   "src/index.ts",
    //   "package.json",
    //   "tsconfig.json",
    //   "tslint.json",
    //   ".editorconfig",
    //   ".gitignore",
    //   "LICENSE",
    //   "README.md",
    //   "wallaby.js",
    //   "serverless.yml"
    // ]);
  });
});

describe.skip("node-typescript:app without gulp", () => {
  before(done => {
    run(path.join(__dirname, "../generators/app"))
      .withOptions({
        skipInstall: true
      })
      .on("end", done);
  });

  // it("creates project files", function() {
  //   assert.file([
  //     ".vscode/tasks.json",
  //     ".vscode/settings.json",
  //     "src/index.ts",
  //     "package.json",
  //     "tsconfig.json",
  //     "tslint.json",
  //     ".travis.yml",
  //     ".editorconfig",
  //     ".gitignore",
  //     "LICENSE",
  //     "README.md"
  //   ]);
  // });
});
