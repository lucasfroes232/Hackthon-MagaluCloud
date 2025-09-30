"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const Agente_Cria_1 = require("./Agents/Agente_Cria");
const Agente_Checa_1 = require("./Agents/Agente_Checa");
// 👇 importa pdf-parse de forma compatível com TypeScript
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require("pdf-parse");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir arquivos estáticos da pasta public
// 👉 coloca o index.html dentro de "public/"
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
// Inicializa OpenAI
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// --- Função auxiliar para ler PDF ---
async function readPDF(filePath) {
    const data = await promises_1.default.readFile(filePath);
    const pdfData = await pdfParse(data);
    return pdfData.text;
}
// --- Rota raiz (para abrir no navegador) ---
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "public", "index.html"));
});
// --- Rota do Agente 1: gerar perguntas ---
app.post("/api/generate", async (req, res) => {
    try {
        const { pdfPath } = req.body;
        if (!pdfPath) {
            return res.status(400).json({ error: "PDF path required" });
        }
        const pdfText = await readPDF(pdfPath);
        const perguntas = await (0, Agente_Cria_1.gerarPerguntas)(openai, pdfText);
        // Salva JSON gerado
        const outputPath = path_1.default.join(__dirname, "..", "perguntas.json");
        await promises_1.default.writeFile(outputPath, JSON.stringify(perguntas, null, 2));
        res.json({ success: true, perguntas });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar perguntas" });
    }
});
// --- Rota do Agente 2: checar respostas ---
app.post("/api/check", async (req, res) => {
    try {
        const { pergunta, palavraBase, resposta } = req.body;
        if (!pergunta || !palavraBase || !resposta) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const resultado = await (0, Agente_Checa_1.checarResposta)(openai, pergunta, palavraBase, resposta);
        res.json(resultado);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao checar resposta" });
    }
});
// --- Inicializa servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
