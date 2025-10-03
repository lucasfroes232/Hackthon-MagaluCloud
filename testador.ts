// testador.ts
import { criarUsuario, buscarUsuarioPorEmail, listarNomesDeRaids, pool, fecharPool } from './src/database';

async function rodarTestes() {
  console.log("--- INICIANDO TESTES ---");

  try {
    // Teste 1: Tenta buscar um usuário que talvez não exista
    const emailBusca = 'teste@exemplo.com';
    console.log(`\nBuscando usuário com email: ${emailBusca}`);
    let usuario = await buscarUsuarioPorEmail(emailBusca);

    if (usuario) {
      console.log("Usuário encontrado:", usuario);
    } else {
      console.log("Usuário não encontrado. Criando um novo...");
      // Teste 2: Cria um novo usuário
      await criarUsuario(emailBusca, 'senha_super_segura_hash_123');
      usuario = await buscarUsuarioPorEmail(emailBusca);
      console.log("Usuário criado com sucesso:", usuario);
    }

    // Teste 3: Lista todas as raids
    console.log("\nListando todas as raids existentes...");
    const raids = await listarNomesDeRaids();
    // Mapeia para exibir só o nome
    const nomesRaids = (raids as { nome_raid: string }[]).map(r => r.nome_raid);
    console.log("Raids encontradas:", nomesRaids);

  } catch (error) {
    console.error("\n!!! OCORREU UM ERRO DURANTE OS TESTES !!!");
    console.error(error);
  } finally {
    console.log("\n--- TESTES CONCLUÍDOS ---");
    // Fecha o pool de conexões do MySQL
    await pool.end();
  }

  await fecharPool();
}

// Executa a função de testes
rodarTestes();

