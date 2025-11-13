import pool from '../config/db.js';

export const usarCartao = async (req, res) => {
  const { id_cartao, id_empresa, valor_passagem } = req.body;

  if (!id_cartao || !id_empresa || !valor_passagem || valor_passagem <= 0) {
    return res.status(400).json({ erro: 'Dados inválidos para uso do cartão.' });
  }

  // Inicia o client para uma transação
  const client = await pool.connect();

  try {
    // Inicia a transação
    await client.query('BEGIN');

    // 1. Verifica saldo geral do cartão (com lock para evitar condição de corrida)
    // "FOR UPDATE" bloqueia a linha até o fim da transação
    const cartao = await client.query(
      'SELECT saldo FROM cartoes WHERE id_cartao = $1 FOR UPDATE', 
      [id_cartao]
    );
    
    if (cartao.rows.length === 0) {
      throw new Error('Cartão não encontrado');
    }

    // 2. Impede o uso sem o saldo suficiente
    if (cartao.rows[0].saldo < valor_passagem) {
      // Desfaz a transação, pois não há nada a ser feito
      await client.query('ROLLBACK');
      return res.status(400).json({ erro: 'Saldo insuficiente' });
    }
    
    // 3. Debita do saldo geral
    const novoSaldo = cartao.rows[0].saldo - valor_passagem;
    await client.query(
      'UPDATE cartoes SET saldo = $1 WHERE id_cartao = $2', 
      [novoSaldo, id_cartao]
    );
    
    // 4. Registra que a empresa X recebeu este valor
    await client.query(
      'INSERT INTO usos_cartao (id_cartao, id_empresa, valor) VALUES ($1, $2, $3)',
      [id_cartao, id_empresa, valor_passagem]
    );
    
    // Confirma a transação
    await client.query('COMMIT');

    // 5. Confirma o uso do cartão e informa o saldo restante
    res.json({ 
      mensagem: `Uso do cartão registrado com sucesso.`,
      saldo_restante: novoSaldo
    });
    
  } catch (err) {
    // Desfaz a transação em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro ao usar cartão:', err);
    res.status(500).json({ erro: 'Erro ao usar cartão: ' + err.message });
  } finally {
    // Libera o client de volta para o pool
    client.release();
  }
};

// Ver extrato (usos do cartão)
// *** ESTE É O NOME CORRIGIDO ***
export const verExtratoUsos = async (req, res) => {
  const { id_cartao } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT e.nome as empresa, u.valor, u.data_uso
      FROM usos_cartao u
      JOIN empresas e ON u.id_empresa = e.id_empresa
      WHERE u.id_cartao = $1
      ORDER BY u.data_uso DESC`, 
      [id_cartao]);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar extrato de usos:', err);
    res.status(500).json({ erro: 'Erro ao buscar extrato de usos' });
  }
};