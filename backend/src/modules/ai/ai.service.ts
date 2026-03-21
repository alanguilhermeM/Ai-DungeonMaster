import { Injectable } from "@nestjs/common";

@Injectable()
export class AiService {
  async generateText(prompt: string): Promise<string> {
    return "Narrativa gerada...";
  }
}