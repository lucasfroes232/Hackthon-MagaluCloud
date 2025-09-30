const fs = require("fs/promises");
const path = require("path");

// Função que checa resposta do usuário
export async function checarResposta(
  openai: any,
  pergunta: string,
  palavraBase: string,
  resposta: string
) {
    const prompt = `
Dada a pergunta "${pergunta}" baseada na palavra "${palavraBase}" e a resposta do usuário "${resposta}", classifique a resposta como bom, medio ou ruim. 
Retorne um JSON com as chaves: classificacao, palavras_chave
`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "system", content: prompt }],
    });

    try {
        const result = JSON.parse(response.choices[0].message.content);
        return result;
    } catch (err) {
        console.error("Erro ao processar resposta:", err);
        return { classificacao: "ruim", palavras_chave: [] };
    }
}
