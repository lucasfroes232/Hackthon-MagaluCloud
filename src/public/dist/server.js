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
const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();
const { gerarPerguntas } = require("./Agents/Agente_Cria");
const { checarResposta } = require("./Agents/Agente_Checa");
const app = express();
app.use(express.json());
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
function readPDF(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const dataBuffer = yield fs.readFile(filePath);
        const data = yield pdfParse(dataBuffer);
        return data.text;
    });
}
app.post("/api/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pdfText = yield readPDF(path.resolve("src/documento.pdf"));
        const perguntas = yield gerarPerguntas(openai, pdfText);
        res.json(perguntas);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar perguntas" });
    }
}));
app.post("/api/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pergunta, palavra_baseada, respostaUsuario } = req.body;
    try {
        const resultado = yield checarResposta(openai, pergunta, palavra_baseada, respostaUsuario);
        res.json(resultado);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao avaliar resposta" });
    }
}));
app.use(express.static(path.resolve("src/public")));
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
