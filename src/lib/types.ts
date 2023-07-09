import { repeat } from "./tuple";
import { z } from "zod";

export type Role = "system" | "user" | "assistant" | "function";

export type FunctionCallMode = "none" | "auto" | { name: string };

export type FunctionDefinition = {
  name: string;
  description?: string;
  parameters?: unknown; // JSON Schema object
};

export type Message = {
  role: Role;
  content?: string;
  name?: string;
  function_call?: unknown; // The name and arguments of a function that should be called, as generated by the model
};

export type Model =
  | "gpt-4"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0613"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-16k-0613";

export type Request<N extends number> = {
  model: Model;
  messages: Message[];
  n: N;
  functions?: FunctionDefinition[];
  function_call?: FunctionCallMode;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string | string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: { [token: string]: number };
  user?: string;
};

const ResponseChoiceMessageSchema = z.object({
  role: z.literal("assistant"),
  content: z.string(),
});

const ResponseChoiceSchema = z.object({
  index: z.number(),
  message: ResponseChoiceMessageSchema,
  finish_reason: z.string(),
});

const ResponseUsageSchema = z.object({
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
});

export function mkResponseSchema<N extends number>(n: N) {
  return z.object({
    id: z.string(),
    object: z.literal("chat.completion"),
    created: z.number(),
    choices: z.tuple(repeat(ResponseChoiceSchema, n)),
    usage: ResponseUsageSchema,
  });
}

export type Response<N extends number> = z.infer<
  ReturnType<typeof mkResponseSchema<N>>
>;
