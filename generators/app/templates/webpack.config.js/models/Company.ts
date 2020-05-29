import { Model, property, model, fks, hasMany, mock } from "firemodel";
import { Person } from "./Person";

@model({ dbOffset: "authenticated" })
export class Company extends Model {
  @property @mock("companyName") public name: string;
  @hasMany(() => Person, "employer") public employees?: fks;
}
