import Base from "yeoman-generator";
import { IDictionary } from "common-types";
import { initializing } from "./initializing";
import { prompting } from "./prompting";
import { install } from "./install";
import { writing } from "./writing";
import { closure } from "./closure";

class Generator extends Base {
  constructor(args: any[], opts: any) {
    super(args, opts);
  }

  public options: IDictionary;
  public answers: IDictionary = {};
  public badges: IDictionary;

  public async initializing() {
    initializing(this)();
  }

  public async prompting() {
    await prompting(this)();
  }

  public async writing() {
    return writing(this)();
  }

  public async install() {
    return install(this);
  }

  public async end() {
    await closure(this);
  }
}

export = Generator;
