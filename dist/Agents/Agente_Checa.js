"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avaliarResposta = avaliarResposta;
const openai_1 = require("openai");
/**
 * Avalia resposta do usuário usando OpenAI
 */
async function avaliarResposta(pergunta, frase_baseada, resposta_usuario) {
    const systemPrompt = `
Você é um avaliador de respostas de quiz.
Receba pergunta, frase base e resposta do usuário.
Seja generoso e retorne um JSON:
- classificacao: bom, medio ou ruim
- palavras_chave: lista de palavras importantes
`;
    const userContent = `
Pergunta: ${pergunta}
Palavra base: ${frase_baseada}
Resposta do usuário: ${resposta_usuario}
`;
    const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userContent },
        ],
    });
    const jsonString = response.choices[0].message?.content;
    let result = {};
    try {
        result = JSON.parse(jsonString || "{}");
    }
    catch {
        result = { raw: jsonString };
    }
    return result;
}
