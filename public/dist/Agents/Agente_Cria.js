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
exports.gerarPerguntas = gerarPerguntas;
exports.gerarPerguntas = gerarPerguntas;
// Função para gerar perguntas
function gerarPerguntas(openai, pdfText) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const systemPrompt = `
Com base nas palavras a seguir gere 5 perguntas com base nessas palavras
e coloque as informações em um JSON com as seguintes chaves: 
pergunta, palavra_baseada, dificuldade
`;
        const response = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: pdfText },
            ],
        });
        const jsonString = ((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || "{}";
        return JSON.parse(jsonString);
    });
}
// Recebe o texto do PDF e retorna o JSON de perguntas
function gerarPerguntas(openai, pdfText) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const systemPrompt = `
Com base nas palavras a seguir gere 5 perguntas com base nessas palavras
e coloque as informações em um JSON com as seguintes chaves: 
pergunta, palavra_baseada, dificuldade
`;
        const response = yield openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: pdfText },
            ],
        });
        const jsonString = ((_a = response.choices[0].message) === null || _a === void 0 ? void 0 : _a.content) || "{}";
        return JSON.parse(jsonString);
    });
}
