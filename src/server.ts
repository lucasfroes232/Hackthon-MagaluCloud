import cors from "cors";
import multer from "multer";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { readPDF, gerarPerguntas } from "./Agents/Agente_Cria";
import { avaliarResposta } from "./Agents/Agente_Checa";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir frontend (CommonJS já tem __dirname)
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), err => {
    if (err) next(err);
  });
});

// Upload de PDF
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const pdfPath = req.file.path;
    const pdfText = await readPDF(pdfPath);

    // Gera perguntas usando Agente_Cria
    const perguntas = await gerarPerguntas(openai, pdfText);

    return res.json({ perguntas });
  } catch (err: any) {
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

    const resultado = await avaliarResposta(pergunta, palavraBase, respostaUsuario);
    return res.json(resultado);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

// Catch-all para SPA (Front-end)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
