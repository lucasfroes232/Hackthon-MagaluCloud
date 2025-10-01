"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const Agente_Cria_1 = require("./Agents/Agente_Cria");
const Agente_Checa_1 = require("./Agents/Agente_Checa");
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// --- Função auxiliar para ler PDF ---
async function readPDF(filePath) {
    const data = await promises_1.default.readFile(filePath);
    const pdfData = await (0, pdf_parse_1.default)(data);
    return pdfData.text;
}
// --- Rotas ---
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "public", "index.html"));
});
app.post("/api/generate", async (req, res) => {
    if (!req.files || !req.files.pdf)
        return res.status(400).json({ error: "Nenhum PDF enviado" });
    const pdfFile = req.files.pdf;
    const tempPath = path_1.default.join(__dirname, "..", "uploads", pdfFile.name);
    await pdfFile.mv(tempPath);
    const pdfText = await readPDF(tempPath);
    const perguntas = await (0, Agente_Cria_1.gerarPerguntas)(openai, pdfText);
    res.json({ success: true, perguntas });
});
app.post("/api/check", async (req, res) => {
    const { pergunta, palavraBase, resposta } = req.body;
    if (!pergunta || !palavraBase || !resposta)
        return res.status(400).json({ error: "Campos faltando" });
    const resultado = await (0, Agente_Checa_1.checarResposta)(openai, pergunta, palavraBase, resposta);
    res.json(resultado);
});
// Exemplo de rota de usuários
app.post("/api/usuarios", async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha)
        return res.status(400).json({ error: "Email ou senha faltando" });
    const existing = await (0, db_1.buscarUsuarioPorEmail)(email);
    if (existing)
        return res.status(400).json({ error: "Usuário já existe" });
    const result = await (0, db_1.criarUsuario)(email, senha);
    res.json({ success: true, result });
});
// --- Inicializa servidor ---
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
