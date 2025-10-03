"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.criarUsuario = criarUsuario;
exports.adicionarRaidAoUsuario = adicionarRaidAoUsuario;
exports.buscarUsuarioPorEmail = buscarUsuarioPorEmail;
exports.listarNomesDeRaids = listarNomesDeRaids;
exports.buscarDocumentosPorRaid = buscarDocumentosPorRaid;
exports.fecharPool = fecharPool;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// --- 1. Configuração da Conexão (Feita uma vez) ---
exports.pool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});
// --- 2. Funções de Consulta (Todas no mesmo arquivo) ---
/**
 * CONSULTA 1: Acrescenta um novo usuário.
 */
async function criarUsuario(email, senhaHash) {
    const sql = "INSERT INTO usuarios (email, senha_hash, arquivos, nome_raid) VALUES (?, ?, NULL, NULL)";
    const [result] = await exports.pool.execute(sql, [email, senhaHash]);
    return result;
}
/**
 * CONSULTA 2: Adiciona arquivos e raid a um usuário existente.
 */
async function adicionarRaidAoUsuario(usuarioId, arquivos, nomeRaid) {
    const sql = "UPDATE usuarios SET arquivos = ?, nome_raid = ? WHERE id = ?";
    const [result] = await exports.pool.execute(sql, [arquivos, nomeRaid, usuarioId]);
    return result;
}
/**
 * CONSULTA 3: Verifica se um usuário existe pelo email.
 */
async function buscarUsuarioPorEmail(email) {
    const sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
    const [rows] = await exports.pool.execute(sql, [email]);
    return rows[0] || null;
}
/**
 * CONSULTA 4A: Exibe todos os nomes de raid existentes (sem repetição).
 */
async function listarNomesDeRaids() {
    const sql = "SELECT DISTINCT nome_raid FROM usuarios WHERE nome_raid IS NOT NULL";
    const [rows] = await exports.pool.execute(sql);
    return rows;
}
/**
 * CONSULTA 4B: Resgata os documentos de uma raid específica.
 */
async function buscarDocumentosPorRaid(nomeRaid) {
    const sql = "SELECT arquivos FROM usuarios WHERE nome_raid = ?";
    const [rows] = await exports.pool.execute(sql, [nomeRaid]);
    return rows;
}
/**
 * FUNÇÃO EXTRA: Fecha o pool (útil para scripts de teste ou shutdown)
 */
async function fecharPool() {
    await exports.pool.end();
}
