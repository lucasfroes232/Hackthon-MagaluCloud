import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// --- Funções de acesso ao banco ---

export async function criarUsuario(email: string, senhaHash: string) {
  const sql = "INSERT INTO usuarios (email, senha_hash, arquivos, nome_raid) VALUES (?, ?, NULL, NULL)";
  const [result] = await pool.execute(sql, [email, senhaHash]);
  return result;
}

export async function adicionarRaidAoUsuario(usuarioId: number, arquivos: string, nomeRaid: string) {
  const sql = "UPDATE usuarios SET arquivos = ?, nome_raid = ? WHERE id = ?";
  const [result] = await pool.execute(sql, [arquivos, nomeRaid, usuarioId]);
  return result;
}

export async function buscarUsuarioPorEmail(email: string) {
  const sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
  const [rows] = await pool.execute(sql, [email]);
  return (rows as any[])[0] || null;
}

export async function listarNomesDeRaids() {
  const sql = "SELECT DISTINCT nome_raid FROM usuarios WHERE nome_raid IS NOT NULL";
  const [rows] = await pool.execute(sql);
  return rows;
}

export async function buscarDocumentosPorRaid(nomeRaid: string) {
  const sql = "SELECT arquivos FROM usuarios WHERE nome_raid = ?";
  const [rows] = await pool.execute(sql, [nomeRaid]);
  return rows;
}
