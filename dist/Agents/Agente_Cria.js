"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPDF = readPDF;
exports.gerarPerguntas = gerarPerguntas;
const promises_1 = __importDefault(require("fs/promises"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
/**
 * Função para ler PDF e retornar texto
 */
async function readPDF(filePath) {
    const dataBuffer = await promises_1.default.readFile(filePath);
    const data = await (0, pdf_parse_1.default)(dataBuffer);
    return data.text;
}
/**
 * Gera perguntas a partir de texto PDF usando OpenAI
 */
async function gerarPerguntas(openai, pdfText) {
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
    let parsedJson = {};
    try {
        parsedJson = JSON.parse(jsonString || "[]");
    }
    catch (err) {
        console.warn("Erro ao converter para JSON, salvando como string bruta.");
        parsedJson = [{ raw: jsonString }];
    }
    return parsedJson;
}
