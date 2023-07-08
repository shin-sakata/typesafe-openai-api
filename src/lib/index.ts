import axios from "axios";
import { Request, Response, ResponseSchema } from "./types";

export class ChatGPT {
  constructor(private apiKey: string) {}

  async createChatCompletion(
    request: Request,
  ): Promise<axios.AxiosResponse<Response>> {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      request,
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );

    return {
      ...res,
      data: ResponseSchema.parse(res.data),
    };
  }
}
