import { Request, Response, mkResponseSchema } from "./types";
import axios from "axios";

export class ChatGPT {
  constructor(private apiKey: string) {}

  async createChatCompletion<N extends number>(
    request: Request<N>,
  ): Promise<axios.AxiosResponse<Response<N>>> {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      request,
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );

    return {
      ...res,
      data: mkResponseSchema(request.n).parse(res.data),
    };
  }
}
