import { it, describe } from "node:test";
import assert from "node:assert";
import { ChatGPT } from "../lib";
import { env } from "./env";

describe("ChatGPT", () => {
  it("should create a chat completion", async () => {
    const chatGPT = new ChatGPT(env.OPENAI_API_KEY);
    const res = await chatGPT.createChatCompletion({
      messages: [{ role: "user", content: "Hello!" }],
      model: "gpt-3.5-turbo-16k-0613",
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.choices.length, 1);
    assert.strictEqual(res.data.choices[0]?.message.role, "assistant");
    assert.strictEqual(typeof res.data.choices[0]?.message.content, "string");
  });
});
