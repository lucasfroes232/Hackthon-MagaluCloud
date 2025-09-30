"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const pdfParse = require("pdf-parse"); // só uma vez aqui
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const Agente_Cria_1 = require("./Agents/Agente_Cria");
const Agente_Checa_1 = require("./Agents/Agente_Checa");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = 3000;
// Configuração do multer (upload)
const upload = (0, multer_1.default)({ dest: "uploads/" });
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
app.post("/api/generate", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum PDF enviado" });
        }
        const pdfText = await readPDF(req.file.path);
        const perguntas = await (0, Agente_Cria_1.gerarPerguntas)(openai, pdfText);
        const outputPath = path_1.default.join(__dirname, "..", "perguntas.json");
        await promises_1.default.writeFile(outputPath, JSON.stringify(perguntas, null, 2));
        return res.json({ success: true, perguntas });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao gerar perguntas" });
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
        return res.json(resultado);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro ao checar resposta" });
    }
});
// --- Inicializa servidor ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
