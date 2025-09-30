import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function readPDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

async function main() {
  const pdfPath = path.join(__dirname, "IA.pdf"); // coloque seu PDF aqui
  const pdfText = await readPDF(pdfPath);

  // Prompt do Agente 1
  const systemPrompt = `
Com base no documento a seguir gere 5 perguntas com base nesse documento sobre a matéria nele
e coloque as informações em um JSON com as seguintes chaves: 
pergunta, frase_baseada, dificuldade.
A dificuldade pode ser facil, medio ou dificil
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: pdfText },
    ],
  });

  const jsonString = response.choices[0].message?.content;

  // Tenta parsear o JSON
  let parsedJson: any = {};
  try {
    parsedJson = JSON.parse(jsonString || "{}");
  } catch (err) {
    console.warn("Erro ao converter para JSON, salvando como string bruta.");
    parsedJson = { raw: jsonString };
  }

  // Salva em arquivo
  const filePath = path.join(__dirname, "perguntas.json");
  await fs.writeFile(filePath, JSON.stringify(parsedJson, null, 2), "utf-8");
  console.log("JSON salvo em:", filePath);
}

main().catch(console.error);
