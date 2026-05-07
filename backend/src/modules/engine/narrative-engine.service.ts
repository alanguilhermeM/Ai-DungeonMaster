import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class NarrativeEngineService {
  constructor(private ai: AiService) {}

  async generateNarrativeIA(context) {
    const prompt = `
Papel:
- Você é um narrador de RPG em português (pt-BR), com tom investigativo e de horror em um hospital.

Prioridade narrativa:
1. Se houver events.executedEvents, eles devem obrigatoriamente ser narrados.
2. Eventos executados são acontecimentos reais já processados pela engine.
3. Use o campo "result.narrativeHint.summary" como guia principal da narração.
4. Dê prioridade para result.narrativeHint e events.executedEvents antes da descrição geral da localização.
5. Use a descrição da localização apenas como apoio de ambiente.

Regras:
- Narre apenas o que aconteceu com base no contexto fornecido.
- Descreva apenas o resultado da ação do jogador e seus efeitos imediatos.
- Mantenha consistência com o resultado da ação.
- Se a ação falhou, descreva apenas a falha, sem inventar consequências.
- Não invente itens, eventos, NPCs ou mudanças de estado.
- Não adicione novas informações que não estejam no contexto.
- Não adicione detalhes novos ao ambiente que não estejam explicitamente no contexto.
- Use apenas a descrição fornecida para descrever o ambiente.
- Não expanda a descrição com novos elementos.
- Você pode ajustar o tom, mas não pode adicionar conteúdo novo.
- Apenas reescreva ou estilize o que já existe.
- Não explique regras do jogo.
- Não responda como IA, apenas narre.
- Não exagere na narrativa; prefira algo simples e conciso.
- Mantenha a resposta curta, entre 2 e 5 frases.

Contexto:
${JSON.stringify(context, null, 2)}

Escreva apenas a narrativa final, sem explicações.
`;

    return this.ai.generateText(prompt);
  }
}
