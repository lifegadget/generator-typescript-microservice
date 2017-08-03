import thingy = require("../src/thingy");
import * as chai from "chai";

const expect = chai.expect;

describe("thingy", () => {
  it("should do something", () => {
    expect(thingy).to.not.equal(undefined);
  });
});
