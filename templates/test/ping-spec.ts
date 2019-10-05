// tslint:disable:no-implicit-dependencies
import ping from "../src/handlers/ping";
import * as chai from "chai";
import * as helpers from "./testing/helpers";
import { DB } from "abstracted-admin";

helpers.setupEnv();
const expect = chai.expect;

let _db: DB;
const db = (passIn?: DB) => {
  if (passIn) {
    _db = passIn;
  }
  if (!_db) {
    _db = new DB();
  }
  return _db;
};

describe("Ping Network Request", () => {
  it("looks like a ping", () => {
    expect(ping).to.be.a("function");
  });
  it("acts like a ping", () => {
    //
  });
  it("must be a ping", () => {
    //
  })
});
