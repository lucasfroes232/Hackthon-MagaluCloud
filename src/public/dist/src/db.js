"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarUsuario = criarUsuario;
exports.adicionarRaidAoUsuario = adicionarRaidAoUsuario;
exports.buscarUsuarioPorEmail = buscarUsuarioPorEmail;
exports.listarNomesDeRaids = listarNomesDeRaids;
exports.buscarDocumentosPorRaid = buscarDocumentosPorRaid;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
// --- Funções de acesso ao banco ---
async function criarUsuario(email, senhaHash) {
    const sql = "INSERT INTO usuarios (email, senha_hash, arquivos, nome_raid) VALUES (?, ?, NULL, NULL)";
    const [result] = await pool.execute(sql, [email, senhaHash]);
    return result;
}
async function adicionarRaidAoUsuario(usuarioId, arquivos, nomeRaid) {
    const sql = "UPDATE usuarios SET arquivos = ?, nome_raid = ? WHERE id = ?";
    const [result] = await pool.execute(sql, [arquivos, nomeRaid, usuarioId]);
    return result;
}
async function buscarUsuarioPorEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
    const [rows] = await pool.execute(sql, [email]);
    return rows[0] || null;
}
async function listarNomesDeRaids() {
    const sql = "SELECT DISTINCT nome_raid FROM usuarios WHERE nome_raid IS NOT NULL";
    const [rows] = await pool.execute(sql);
    return rows;
}
async function buscarDocumentosPorRaid(nomeRaid) {
    const sql = "SELECT arquivos FROM usuarios WHERE nome_raid = ?";
    const [rows] = await pool.execute(sql, [nomeRaid]);
    return rows;
}
