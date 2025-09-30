import OpenAI from "openai";
import readline from "readline";
import { checarResposta } from "./Agents/Agente_Checa";
import dotenv from "dotenv";

dotenv.config();

// Cria cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Função auxiliar para ler input do usuário
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Exemplo de uso
async function main() {
  const pergunta = "O que é programação orientada a objetos?";
  const palavraBase = "programação";

  let acerto = false;

  while (!acerto) {
    const respostaUsuario = await askQuestion(`Pergunta: ${pergunta}\nResposta: `);

    const resultado = await checarResposta(openai, pergunta, palavraBase, respostaUsuario);

    console.log("Classificação:", resultado.classificacao);
    console.log("Palavras-chave encontradas:", resultado.palavras_chave.join(", "));

    if (resultado.classificacao === "bom") {
      console.log("Resposta correta! Passando para a próxima pergunta...");
      acerto = true;
    } else {
      console.log("Resposta insuficiente. Tente novamente.\n");
    }
  }
}

main();
