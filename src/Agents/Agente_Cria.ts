import OpenAI from "openai";

export async function gerarPerguntas(openai: OpenAI, pdfText: string) {
  // instrução para o modelo gerar perguntas baseadas no texto do PDF
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "Você é um professor que gera perguntas de múltipla escolha com base em textos fornecidos."
      },
      {
        role: "user",
        content: `Gere 3 perguntas de múltipla escolha sobre o seguinte texto:\n\n${pdfText}`
      }
    ],
  });

  // retorna o conteúdo da resposta
  return completion.choices[0].message?.content ?? "";
}