import { OpenAI } from "openai";

export async function avaliarResposta(pergunta: string, palavraBase: string, respostaUsuario: string) {
  const prompt = `
Pergunta: ${pergunta}
Resposta esperada (palavraBase): ${palavraBase}
Resposta do usuário: ${respostaUsuario}

Verifique se a resposta do usuário está correta ou aceitável, considerando pequenas variações de linguagem.
Responda apenas em JSON com o formato:
{
  "correto": true/false,
  "feedback": "string explicando brevemente"
}
`;

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  let avaliacao: { correto: boolean; feedback: string } = { correto: false, feedback: "Erro ao avaliar" };
  try {
    avaliacao = JSON.parse(completion.choices[0].message.content || "{}");
  } catch (err) {
    console.error("Erro ao parsear JSON:", err);
  }

  return avaliacao;
}
