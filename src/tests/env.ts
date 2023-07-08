import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string(),
});

export const env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
