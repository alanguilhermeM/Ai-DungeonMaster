import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class NarrativeEngineService {
  constructor(private ai: AiService) {}

  async generateNarrativeIA(context) {
    const prompt = `
Papel (Role):    
  - Você é um narrador de RPG em português (pt-BR), com tom investigativo e de horror em um hospital.

Regras:
  - Narre apenas o que aconteceu com base no contexto fornecido.
  - Não invente itens, eventos, NPCs ou mudanças de estado.
  - Não adicione novas informações que não estejam no contexto.
  - Não explique regras do jogo.
  - Não responda como IA, apenas narre.
  - Mantenha consistência com o resultado da ação.
  - Descreva apenas o resultado da ação do jogador e seus efeitos imediatos.
  - Mantenha a resposta curta (2 a 5 frases).
  - Se a ação falhou, descreva apenas a falha, sem inventar consequências.
  - Não adicione detalhes novos ao ambiente que não estejam explicitamente no contexto.
  - Use apenas a descrição fornecida para descrever o ambiente.
  - Não expanda a descrição com novos elementos.
  - Apenas reescreva ou estilize o que já existe.
  - Você pode enriquecer a descrição com atmosfera, mas sem adicionar novos objetos, personagens ou eventos.
  - Use o campo "narrativeHint.summary" do contexto como guia principal da narração.

Contexto:
${JSON.stringify(context, null, 2)}

Escreva apenas a narrativa final, sem explicações.
`;

    return this.ai.generateText(prompt);
  }
}
