"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const readline_1 = __importDefault(require("readline"));
const Agente_Checa_1 = require("./Agents/Agente_Checa");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Cria cliente OpenAI
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
// Função auxiliar para ler input do usuário
function askQuestion(query) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}
// Exemplo de uso
async function main() {
    const pergunta = "O que é programação orientada a objetos?";
    const palavraBase = "programação";
    let acerto = false;
    while (!acerto) {
        const respostaUsuario = await askQuestion(`Pergunta: ${pergunta}\nResposta: `);
        const resultado = await (0, Agente_Checa_1.checarResposta)(openai, pergunta, palavraBase, respostaUsuario);
        console.log("Classificação:", resultado.classificacao);
        console.log("Palavras-chave encontradas:", resultado.palavras_chave.join(", "));
        if (resultado.classificacao === "bom") {
            console.log("Resposta correta! Passando para a próxima pergunta...");
            acerto = true;
        }
        else {
            console.log("Resposta insuficiente. Tente novamente.\n");
        }
    }
}
main();
