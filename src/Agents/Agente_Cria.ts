import { OpenAI } from "openai";
import fs from "fs/promises";
import pdfParse from "pdf-parse";

/**
 * Função para ler PDF e retornar texto
 */
export async function readPDF(filePath: string): Promise<string> {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

/**
 * Gera perguntas a partir de texto PDF usando OpenAI
 */
export async function gerarPerguntas(openai: OpenAI, pdfText: string) {
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

  let parsedJson: any = {};
  try {
    parsedJson = JSON.parse(jsonString || "[]");
  } catch (err) {
    console.warn("Erro ao converter para JSON, salvando como string bruta.");
    parsedJson = [{ raw: jsonString }];
  }

  return parsedJson;
}
