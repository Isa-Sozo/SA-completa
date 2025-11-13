import pool from '../config/db.js';

// Lista as recargas feitas
export const listarRecargas = async (req, res) => {
  // Pega o ID do usuário logado (do token)
  const id_usuario_logado = req.id_usuario;

  try {
    // Modifica a query para buscar recargas APENAS dos cartões que pertencem ao usuário logado
    const result = await pool.query(`
      SELECT r.id_recarga, c.numero_cartao, r.valor, r.data_recarga
      FROM recargas r
      JOIN cartoes c ON r.id_cartao = c.id_cartao
      WHERE c.id_usuario = $1
      ORDER BY r.data_recarga DESC
    `, [id_usuario_logado]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar recargas:', err);
    res.status(500).json({ erro: 'Erro ao listar recargas' });
  }
};

// Adiciona uma nova recarga
export const adicionarRecarga = async (req, res) => {
  const { id_cartao, valor } = req.body;
  
  // Pega o ID do usuário logado (injetado pelo middleware 'proteger')
  const id_usuario_logado = req.id_usuario; 
  
  // Validação básica
  if (!id_cartao || !valor || valor <= 0) {
    return res.status(400).json({ erro: 'Dados inválidos. Verifique o ID do cartão e o valor.' });
  }

  // Inicia o client para uma transação
  const client = await pool.connect();
  
  try {
    // Verifica se o cartão pertence ao usuário que está logado
    const cartaoResult = await client.query('SELECT id_usuario FROM cartoes WHERE id_cartao = $1', [id_cartao]);
    
    if (cartaoResult.rows.length === 0) {
      // Libera o client e retorna erro se o cartão não existir
      client.release();
      return res.status(404).json({ erro: 'Cartão não encontrado' });
    }

    if (cartaoResult.rows[0].id_usuario !== id_usuario_logado) {
      // Libera o client e retorna erro se o cartão não for do usuário
      client.release();
      return res.status(403).json({ erro: 'Operação não permitida. Este cartão não pertence a você.' });
    }
    // --- FIM DA VERIFICAÇÃO DE SEGURANÇA ---

    // Inicia a transação
    await client.query('BEGIN');
    
    // Apenas adiciona ao saldo geral do cartão
    // Adicionamos "RETURNING saldo" para pegar o novo saldo atualizado
    const updateResult = await client.query(
      'UPDATE cartoes SET saldo = saldo + $1 WHERE id_cartao = $2 RETURNING saldo', 
      [valor, id_cartao]
    );
    
    // Pega o saldo que foi retornado pela query anterior
    
    // <<< CORREÇÃO AQUI >>>
    // A lib 'pg' retorna o tipo DECIMAL como string (ex: "50.00").
    // Precisamos convertê-lo para um número (float) antes de enviar.
    const novoSaldo = parseFloat(updateResult.rows[0].saldo); 

    // Registra a recarga
    await client.query('INSERT INTO recargas (id_cartao, valor) VALUES ($1, $2)', [id_cartao, valor]);
    
    // Confirma a transação
    await client.query('COMMIT');
    
    // Envia a resposta de sucesso com o novo saldo (agora como NÚMERO)
    res.status(201).json({ 
      mensagem: 'Recarga realizada com sucesso',
      novo_saldo: novoSaldo // Envia o novo saldo para o front-end
    });
    
  } catch (err) {
    // Desfaz a transação em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro na transação de recarga:', err);
    res.status(500).json({ erro: 'Erro ao adicionar recarga', detalhe: err.message });
  } finally {
    // Libera o client de volta para o pool
    client.release();
  }
};