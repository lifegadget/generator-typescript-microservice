// tslint:disable:no-implicit-dependencies
import ping from "../src/ping");
import * as chai from "chai";

const expect = chai.expect;

describe("Ping Network Request", () => {
  it("looks like a ping", () => {
    expect(ping).to.be.a('function');
  });
  it("acts like a ping", () => {
    //
  })
});
