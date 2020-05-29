import {
  Model,
  property,
  min,
  max,
  length,
  model,
  fk,
  belongsTo,
} from "firemodel";
import { Company } from "./Company";

@model({ dbOffset: "authenticated" })
export class Person extends Model {
  @property @length(20) public name: string;
  @property @min(1) @max(100) public age?: number;
  @property public gender?: "male" | "female" | "other";
  @belongsTo(() => Company, "employees") public employer?: fk;
}
