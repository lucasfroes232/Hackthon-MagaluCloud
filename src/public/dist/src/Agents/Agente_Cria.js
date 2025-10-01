"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gerarPerguntas = gerarPerguntas;
async function gerarPerguntas(openai, pdfText) {
    const prompt = `
Com base no seguinte texto extraído do PDF, gere 5 perguntas de múltipla escolha:
${pdfText}
Retorne no formato JSON: [{ "pergunta": "", "opcoes": ["", "", ""], "resposta_correta": "" }]
`;
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
    });
    const content = response.choices[0].message?.content || "[]";
    try {
        return JSON.parse(content);
    }
    catch {
        return [];
    }
}
