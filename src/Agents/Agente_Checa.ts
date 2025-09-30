import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import readline from "readline";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Função para ler input do usuário
function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

// Função que envia a pergunta + resposta do usuário para GPT e recebe classificação e palavras-chave
async function avaliarResposta(pergunta: string, palavraBase: string, respostaUsuario: string) {
  const systemPrompt = `
Você é um avaliador de respostas de quiz. Receba a pergunta, a palavra base e a resposta do usuário e em seus conhecimentos. Seja generoso na sua avaliação e tente dar sempre mais positivo
Retorne um JSON com as seguintes chaves:
- classificacao: bom, medio ou ruim
- palavras_chave: uma lista de palavras importantes na resposta do usuário
`;

  const userContent = `
Pergunta: ${pergunta}
Palavra base: ${palavraBase}
Resposta do usuário: ${respostaUsuario}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
  });

  const jsonString = response.choices[0].message?.content;

  let result: any = {};
  try {
    result = JSON.parse(jsonString || "{}");
  } catch (err) {
    console.warn("Erro ao converter para JSON, salvando como string bruta.");
    result = { raw: jsonString };
  }

  return result;
}

// Função principal
async function main() {
  const parsedPath = path.join(__dirname, "perguntas.json");
  const parsedData = JSON.parse(await fs.readFile(parsedPath, "utf-8"));

  if (!Array.isArray(parsedData)) {
    console.error("O JSON precisa ser um array de perguntas.");
    return;
  }

  const respostasFinais: any[] = [];

  for (const item of parsedData) {
    const pergunta = item.pergunta;
    const frase_baseada = item.frase_baseada;
    let acerto = false;

    while (!acerto) {
      const respostaUsuario = await askQuestion(`Pergunta: ${pergunta}\nPalavra base: ${frase_baseada}\nSua resposta: `);
      const avaliacao = await avaliarResposta(pergunta, frase_baseada, respostaUsuario);

      console.log("Avaliação:", avaliacao);

    if ((avaliacao.classificacao || "").toLowerCase().trim() === "bom") {
        acerto = true;
        respostasFinais.push({
          pergunta,
          frase_do_documento: frase_baseada,
          resposta: respostaUsuario,
          avaliacao,
        });
      } else {
        console.log(`resposta:${avaliacao.classificação}\n`);        
        console.log("Resposta insuficiente. Tente novamente.\n");
      }
    }
  }

  const outputPath = path.join(__dirname, "response.json");
  await fs.writeFile(outputPath, JSON.stringify(respostasFinais, null, 2), "utf-8");
  console.log("Todas respostas registradas em:", outputPath);
}

main().catch(console.error);
