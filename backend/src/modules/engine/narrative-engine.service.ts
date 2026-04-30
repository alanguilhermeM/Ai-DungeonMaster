import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class NarrativeEngineService {
  constructor(private ai: AiService) {}

  async generateNarrativeIA(context) {
    const prompt = `
Você é um narrador de RPG em pt-br.
Use tom de RPG investigativo/horror hospitalar
não inventar itens
não alterar estado
não criar NPCs
não desbloquear pistas
narrar só o que veio da engine
`;

    return this.ai.generateText(prompt);
  }
}
