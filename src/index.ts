import Base from "yeoman-generator";
import { IDictionary } from "common-types";
import { initializing } from "./initializing";
import { prompting } from "./prompting";
import { install } from "./install";
import { writing } from "./writing";
import { closure } from "./closure";

export class Generator extends Base {
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

  public async writing(): Promise<void> {
    return writing(this)();
  }

  public async install(): Promise<void> {
    return install(this);
  }

  public async end() {
    await closure(this);
  }
}
