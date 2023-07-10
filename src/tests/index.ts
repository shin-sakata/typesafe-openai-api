import { ChatGPT } from "../lib";
import { NonEmptyArray, Repeat, repeat } from "../lib/tuple";
import { FunctionDefinition } from "../lib/types";
import { env } from "./env";
import assert from "node:assert";
import { describe, it } from "node:test";
import { z } from "zod";

declare function assertSame<A, B>(
  expect: [A] extends [B] ? ([B] extends [A] ? true : false) : false,
): void;

const functions = [
  {
    name: "add",
    description: "Add two numbers",
    parameters: z.object({ lhs: z.number(), rhs: z.number() }),
  } as const,
] satisfies NonEmptyArray<FunctionDefinition>;

describe("ChatGPT", () => {
  it("should create a chat completion", async () => {
    const chatGPT = new ChatGPT(env.OPENAI_API_KEY);
    const res = await chatGPT.createChatCompletion({
      messages: [{ role: "user", content: "Hello!" }],
      model: "gpt-3.5-turbo-16k-0613",
      n: 1,
      functions,
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.choices.length, 1);
    assert.strictEqual(res.data.choices[0].message.role, "assistant");

    if ("content" in res.data.choices[0].message) {
      assert.strictEqual(typeof res.data.choices[0].message.content, "string");
    }

    if ("function_call" in res.data.choices[0].message) {
      assert.strictEqual(
        typeof res.data.choices[0].message.function_call,
        "object",
      );
    }
  });

  it("should create a chat completion with n = 2", async () => {
    const chatGPT = new ChatGPT(env.OPENAI_API_KEY);
    const res = await chatGPT.createChatCompletion({
      messages: [{ role: "user", content: "Hello!" }],
      model: "gpt-3.5-turbo-16k-0613",
      n: 2,
      functions,
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.choices.length, 2);
  });
});

describe("Repeat", () => {
  it("should repeat a type", { skip: true }, () => {
    assertSame<Repeat<1, 3>, [1, 1, 1]>(true);
    assertSame<Repeat<"hoge", 3>, ["hoge", "hoge", "hoge"]>(true);
    assertSame<Repeat<1, 3>, [1, 1, 1, 1]>(false);
  });
});

describe("repeat", () => {
  it("should repeat a value", () => {
    assert.deepStrictEqual(repeat(1, 5), [1, 1, 1, 1, 1]);
    assert.deepStrictEqual(repeat(1, 3), [1, 1, 1]);
  });
});
