import { NonEmptyArray } from "./tuple";
import {
  FunctionDefinition,
  Request,
  Response,
  mkResponseSchema,
} from "./types";
import axios from "axios";
import zodToJsonSchema from "zod-to-json-schema";

export class ChatGPT {
  constructor(private apiKey: string) {}

  async createChatCompletion<
    N extends number,
    T extends NonEmptyArray<FunctionDefinition>,
  >(request: Request<N, T>): Promise<axios.AxiosResponse<Response<N, T>>> {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        ...request,
        functions: request.functions.map((f) => {
          return {
            name: f.name,
            description: f.description,
            parameters: zodToJsonSchema(f.parameters),
          };
        }),
      },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );

    return {
      ...res,
      data: mkResponseSchema(request.n, request.functions).parse(res.data),
    };
  }
}
