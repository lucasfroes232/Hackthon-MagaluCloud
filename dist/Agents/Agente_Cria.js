"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPDF = readPDF;
exports.gerarPerguntas = gerarPerguntas;
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const fs_1 = __importDefault(require("fs"));
// Função para ler PDF
async function readPDF(filePath) {
    const dataBuffer = fs_1.default.readFileSync(filePath);
    const pdfData = await (0, pdf_parse_1.default)(dataBuffer);
    return pdfData.text;
}
// Função para gerar perguntas
async function gerarPerguntas(openai, texto) {
    // mostrar que foi chamado a funcao
    console.log("gerarPerguntas foi chamado");
    const prompt = `
Com base no documento a seguir gere 5 perguntas com base nesse documento.

"${texto}"

Retorne apenas um JSON puro, sem Markdown ou backticks, no formato:
{
  "pergunta": "...",
  "palavraBase": "..." // resposta esperada resumida em 1 palavra ou frase curta
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
    }
    catch (err) {
        console.error("Erro ao parsear perguntas:", err);
        return [];
    }
}
