"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checarResposta = checarResposta;
function checarResposta(openai, pergunta, palavra_baseada, respostaUsuario) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const systemPrompt = `
Você é um avaliador de respostas de quiz. Receba a pergunta, a palavra base e a resposta do usuário.
Retorne um JSON com as seguintes chaves:
- classificação: "bom", "medio" ou "ruim"
- palavras_chave: uma lista de palavras importantes na resposta do usuário
`;
        const userContent = `
Pergunta: ${pergunta}
Palavra base: ${palavra_baseada}
Resposta do usuário: ${respostaUsuario}
`;
        const response = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userContent },
            ],
        });
        return JSON.parse(((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || "{}");
    });
}
