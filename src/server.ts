import express, { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import fileUpload from "express-fileupload";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import OpenAI from "openai";

import { gerarPerguntas } from "./Agents/Agente_Cria";
import { checarResposta } from "./Agents/Agente_Checa";
import { criarUsuario, buscarUsuarioPorEmail } from "./db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "..", "public")));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Função auxiliar para ler PDF ---
async function readPDF(filePath: string) {
  const data = await fs.readFile(filePath);
  const pdfData = await pdfParse(data);
  return pdfData.text;
}

// --- Rotas ---
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.post("/api/generate", async (req: Request, res: Response) => {
  if (!req.files || !req.files.pdf) return res.status(400).json({ error: "Nenhum PDF enviado" });
  const pdfFile = req.files.pdf as fileUpload.UploadedFile;
  const tempPath = path.join(__dirname, "..", "uploads", pdfFile.name);
  await pdfFile.mv(tempPath);

  const pdfText = await readPDF(tempPath);
  const perguntas = await gerarPerguntas(openai, pdfText);

  res.json({ success: true, perguntas });
});

app.post("/api/check", async (req: Request, res: Response) => {
  const { pergunta, palavraBase, resposta } = req.body;
  if (!pergunta || !palavraBase || !resposta)
    return res.status(400).json({ error: "Campos faltando" });

  const resultado = await checarResposta(openai, pergunta, palavraBase, resposta);
  res.json(resultado);
});

// Exemplo de rota de usuários
app.post("/api/usuarios", async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Email ou senha faltando" });

  const existing = await buscarUsuarioPorEmail(email);
  if (existing) return res.status(400).json({ error: "Usuário já existe" });

  const result = await criarUsuario(email, senha);
  res.json({ success: true, result });
});

// --- Inicializa servidor ---
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
