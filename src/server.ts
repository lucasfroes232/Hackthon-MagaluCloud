import express, { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
const pdfParse = require("pdf-parse"); // só uma vez aqui
import dotenv from "dotenv";
import OpenAI from "openai";
import { gerarPerguntas } from "./Agents/Agente_Cria";
import { checarResposta } from "./Agents/Agente_Checa";

dotenv.config();

const app = express();
const PORT = 3000;

// Configuração do multer (upload)
const upload = multer({ dest: "uploads/" });

// Criamos um tipo estendido para suportar `req.file`
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
// 👉 coloca o index.html dentro de "public/"
app.use(express.static(path.join(__dirname, "..", "public")));

// Inicializa OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// --- Função auxiliar para ler PDF ---
async function readPDF(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);
  const pdfData = await pdfParse(data);
  return pdfData.text;
}

// --- Rota raiz (para abrir no navegador) ---
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

// --- Rota do Agente 1: gerar perguntas ---
app.post(
  "/api/generate",
  upload.single("pdf"),
  async (req: MulterRequest, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum PDF enviado" });
      }

      const pdfText = await readPDF(req.file.path);
      const perguntas = await gerarPerguntas(openai, pdfText);

      const outputPath = path.join(__dirname, "..", "perguntas.json");
      await fs.writeFile(outputPath, JSON.stringify(perguntas, null, 2));

      return res.json({ success: true, perguntas });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao gerar perguntas" });
    }
  }
);


// --- Rota do Agente 2: checar respostas ---
app.post("/api/check", async (req: Request, res: Response) => {
  try {
    const { pergunta, palavraBase, resposta } = req.body;
    if (!pergunta || !palavraBase || !resposta) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const resultado = await checarResposta(openai, pergunta, palavraBase, resposta);
    return res.json(resultado);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao checar resposta" });
  }
});


// --- Inicializa servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
