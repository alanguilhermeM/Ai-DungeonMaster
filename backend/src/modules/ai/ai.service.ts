import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class AiService {
  private readonly ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  async generateText(prompt: string): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text ?? 'Nada acontece.';
  }
}
