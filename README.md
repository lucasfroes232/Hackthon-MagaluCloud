# MindBoss 🎮🧠

## Visão Geral
O **MindBoss** é um jogo web gamificado que transforma o estudo em uma batalha épica contra um chefão.  
O jogador derrota o boss ao responder corretamente perguntas geradas automaticamente a partir de conteúdos enviados por ele mesmo.  

Nosso objetivo é ajudar pessoas que adiam ou procrastinam os estudos a se engajarem de forma lúdica. Assim, o usuário sente que está “jogando” em vez de apenas estudando — mas, ao mesmo tempo, está aprendendo de verdade.


## Problema  
Muitos estudantes têm dificuldade em manter foco e motivação durante os estudos. A procrastinação aparece como uma barreira constante, tornando tarefas como ler, revisar e praticar algo pouco atraente.  


## Solução  
O **MindBoss** une **IA generativa** e **gamificação** para reverter a lógica da procrastinação:  
- O usuário **se diverte** enquanto joga.  
- As perguntas são geradas **diretamente do material de estudo** enviado.  
- O ato de estudar se transforma em uma batalha interativa.  


## Fluxo de Uso  
1. O usuário registra uma conta ou faz login.  
2. Cria uma **raid** (batalha) ou entra em uma já existente.  
   - Ao criar, ele pode enviar arquivos PDF com o conteúdo que deseja estudar.  
3. O sistema extrai o texto e envia para o agente de IA.  
4. O agente gera **15 perguntas de diferentes níveis de dificuldade**.  
5. O jogador responde no formato de quiz.  
   - Cada acerto gera **dano no boss**.  
   - Quando a barra de vida do boss chega a zero, a raid é concluída.  


## Arquitetura  

### Estrutura  
- **Banco de Dados**: MySQL.  
- **Infra**:  
  - 1 VM (hospeda o front e back-end).  
  - 1 instância do banco de dados.  
- **Agente de IA**: ChatGPT (via API da OpenAI).  

### Fluxo Técnico  
- O **front-end** (JavaScript) envia requisições para o **back-end** (TypeScript).  
- O back-end:  
  - Faz requisições para o LLM (ChatGPT).  
  - Gerencia as raids, perguntas e respostas.  
  - Salva tudo no banco MySQL.   


## Tecnologias Usadas  
- **Front-end**: JavaScript.  
- **Back-end**: TypeScript.  
- **Banco de Dados**: MySQL.  
- **Infraestrutura**: VM + DB Instance na **Magalu Cloud**.  
- **IA**: ChatGPT (API OpenAI).  


## Próximos Passos  
- Implementar **leaderboard** com ranking de jogadores.  
- Adicionar novos bosses e elementos visuais de RPG.  
- Permitir que vários jogadores estudem em conjunto em uma mesma raid. 
- Validação de usuários.
- Validação de documentos.


## Conclusão  
O **MindBoss** foi criado para transformar o momento de procrastinação em motivação, unindo **diversão e aprendizado**. Através da gamificação e do uso de IA, a plataforma ajuda estudantes a engajarem-se com seus próprios conteúdos de estudo de forma prática e divertida.  
