import { describe, it } from "node:test";
import assert from "node:assert";

import { add } from "../lib";

describe("add", () => {
  it("should add two numbers", () => {
    assert.strictEqual(add(1, 2), 3);
  });

  it("does not minus two numbers", () => {
    assert.notStrictEqual(add(1, 2), -1);
  });
});
