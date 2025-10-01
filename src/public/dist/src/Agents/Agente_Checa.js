"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checarResposta = checarResposta;
async function checarResposta(openai, pergunta, palavraBase, resposta) {
    const prompt = `
Dada a pergunta "${pergunta}" baseada na palavra "${palavraBase}" e a resposta do usuário "${resposta}", classifique como bom, medio ou ruim.
Retorne um JSON com: { "classificacao": "", "palavras_chave": [] }
`;
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
    });
    // Garantir que content seja string
    const content = response.choices[0].message?.content || "{}";
    try {
        return JSON.parse(content);
    }
    catch (err) {
        console.error("Erro ao processar resposta:", err);
        return { classificacao: "ruim", palavras_chave: [] };
    }
}
