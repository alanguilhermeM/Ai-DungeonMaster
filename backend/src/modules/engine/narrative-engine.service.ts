import { Injectable } from '@nestjs/common';

@Injectable()
export class NarrativeEngineService {
  constructor(private ai: AiService) {}

  async generate(state: any, action: any) {
    const prompt = `
Você é um narrador de RPG.

Estado atual:
${JSON.stringify(state)}

Ação do jogador:
${action.input}

Descreva o que acontece.
`;

    return this.ai.generateText(prompt);
  }
}
