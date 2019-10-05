import { IGeneratorDictionary } from "../@types";
import { promisify } from "util";

export function initializeRepo(context: IGeneratorDictionary) {
  const git = require("simple-git")(context.destinationPath());
  return promisify(git.init) as () => Promise<void>;
}

export function checkIsRepo(context: IGeneratorDictionary) {
  const git = require("simple-git")(context.destinationPath());
  return promisify(git.checkIsRepo) as () => Promise<boolean>;
}

export function addRemote(context: IGeneratorDictionary) {
  const git = require("simple-git")(context.destinationPath());
  return promisify(git.addRemote) as (
    name: string,
    repo: string
  ) => Promise<void>;
}
