// Importa as bibliotecas necessárias
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// 1. Configuração da Conexão com o Banco de Dados
// Usamos um "Pool" de conexões para melhor performance e gerenciamento
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("Pool de conexões com o MySQL configurado.");

// Interface para o objeto de usuário que vamos salvar
interface DadosUsuario {
  nome: string;
  email: string;
  senha: string; // Senha em texto puro, antes de hashear
  cidade?: string; // O '?' torna o campo opcional
}

/**
 * Função principal para salvar um usuário no banco de dados MySQL.
 * Ela hasheia a senha e insere os dados de forma segura.
 * @param usuario Os dados do usuário a serem salvos.
 */
async function salvarUsuario(usuario: DadosUsuario) {
  let connection;
  try {
    // 2. Hashear a senha antes de salvar (Segurança)
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(usuario.senha, saltRounds);
    console.log("Senha hasheada com sucesso.");

    // 3. Obter uma conexão do pool
    connection = await pool.getConnection();
    console.log("Conexão com o banco de dados obtida.");

    // 4. Criar o comando SQL com placeholders (?) para evitar SQL Injection
    // IMPORTANTE: Nunca concatene os valores diretamente na string SQL!
    const sql = `
      INSERT INTO usuarios (nome, email, senha_hash, cidade) 
      VALUES (?, ?, ?, ?)
    `;

    // Os valores que substituirão os placeholders (?) na ordem correta
    const values = [usuario.nome, usuario.email, senhaHash, usuario.cidade || null];

    // 5. Executar o comando no banco de dados
    const [result] = await connection.execute(sql, values);
    
    console.log("Usuário inserido com sucesso!", result);
    return result;

  } catch (error) {
    console.error("Erro ao salvar usuário no banco de dados:", error);
    // Lançar o erro permite que quem chamou a função saiba que algo deu errado
    throw error;
  } finally {
    // 6. Liberar a conexão de volta para o pool, ocorrendo erro ou não
    if (connection) {
      connection.release();
      console.log("Conexão liberada.");
    }
  }
}

// --- Exemplo de Uso ---
// O objeto com os dados que viriam do front-end ou de outra parte da sua aplicação
const novoUsuario: DadosUsuario = {
  nome: 'Carlos Souza',
  email: 'carlos.souza@example.com',
  senha: 'umaSenhaMuitoSegura456', // A senha original
  cidade: 'Rio de Janeiro'
};

// Chamando a função para salvar o usuário
salvarUsuario(novoUsuario)
  .then(() => {
    console.log("\nProcesso finalizado com sucesso.");
    pool.end(); // Opcional: fechar todas as conexões se o script for terminar
  })
  .catch(() => {
    console.error("\nOcorreu uma falha no processo.");
    pool.end();
  });