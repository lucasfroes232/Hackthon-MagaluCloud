"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = require("openai");
const Agente_Cria_1 = require("./Agents/Agente_Cria");
const Agente_Checa_1 = require("./Agents/Agente_Checa");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const upload = (0, multer_1.default)({ dest: "uploads/" });
const openai = new openai_1.OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir frontend (CommonJS já tem __dirname)
app.use((req, res, next) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'), err => {
        if (err)
            next(err);
    });
});
// Upload de PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }
        const pdfPath = req.file.path;
        const pdfText = await (0, Agente_Cria_1.readPDF)(pdfPath);
        // Gera perguntas usando Agente_Cria
        const perguntas = await (0, Agente_Cria_1.gerarPerguntas)(openai, pdfText);
        return res.json({ perguntas });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});
// Avaliar resposta do usuário usando Agente_Checa
app.post("/avaliar-resposta", async (req, res) => {
    try {
        const { pergunta, palavraBase, respostaUsuario } = req.body;
        if (!pergunta || !palavraBase || !respostaUsuario) {
            return res.status(400).json({ error: "Dados incompletos." });
        }
        const resultado = await (0, Agente_Checa_1.avaliarResposta)(pergunta, palavraBase, respostaUsuario);
        return res.json(resultado);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
});
// Catch-all para SPA (Front-end)
app.use((req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'public', 'index.html'));
});
// Start server
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
