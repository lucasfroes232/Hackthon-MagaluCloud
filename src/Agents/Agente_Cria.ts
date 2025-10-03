import { OpenAI } from "openai";
import pdfParse from "pdf-parse";
import fs from "fs";

// Função para ler PDF
export async function readPDF(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}

// Função para gerar perguntas
export async function gerarPerguntas(openai: OpenAI, texto: string) {
// mostrar que foi chamado a funcao

console.log("gerarPerguntas foi chamado");

  const prompt = `
Com base no documento a seguir gere 5 perguntas com base nesse documento.

"${texto}"

Retorne apenas um JSON puro, sem Markdown ou backticks, no formato:
{
  "pergunta": "...",
  "frase_baseada": "..." // uma frase curta baseada no texto que voce usou para criar a pergunta
}
Retorne um array JSON válido.
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
  });

  // Pega o texto da resposta
  const content = response.choices[0].message.content;

  try {
    const perguntas = JSON.parse(content || "[]");
    return perguntas;
  } catch (err) {
    console.error("Erro ao parsear perguntas:", err);
    return [];
  }
}
