// src/db/seeds/01_seed_completo.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // ----------------------------------------------------
  // 1. Limpeza das Tabelas (Ordem Inversa da Dependência)
  // ----------------------------------------------------
  // Nota: Você deve deletar os dados na ordem INVERSA da criação
  await knex('itens_pedido').del(); 
  await knex('pedidos').del(); 
  await knex('produtos').del(); 
  await knex('marcas').del();
  await knex('clientes').del();


  // ====================================================
  // 2. INSERÇÃO DE DADOS (Ordem Correta de Dependência)
  // ====================================================

  // A) MARCAS (Não depende de ninguém)
  const marcas = [
    {id: 1, nome: 'Apple', site: 'apple.com', telefone: '0800-761-0867'},
    {id: 2, nome: 'Samsung', site: 'samsung.com', telefone: '0800-761-0900'},
    {id: 3, nome: 'Xiaomi', site: 'xiaomi.com', telefone: '0800-761-0800'},
    {id: 4, nome: 'Huawei', site: 'huawei.com', telefone: '0800-761-0700'}
  ];
  await knex('marcas').insert(marcas);
  console.log('Dados inseridos na tabela: marcas');

  // B) CLIENTES (Não depende de ninguém)
  // Nota: O campo data_nascimento não estava no seu CSV de clientes, 
  // então o Knex irá usar o valor padrão ou você precisará adicionar no CSV/código.
  const clientes = [
    {id: 1, nome: 'Daniel Ventura', email: 'daniel@email.com', cidade: 'Juiz de Fora'},
    {id: 2, nome: 'Danilu Samuel', email: 'danilu@email.com', cidade: 'Santana de Cataguases'},
    {id: 3, nome: 'Larissa da Glória', email: 'larissa@email.com', cidade: 'Cataguases'},
    {id: 4, nome: 'Lucas Araújo', email: 'lucas.a@email.com', cidade: 'Leopoldina'},
    {id: 5, nome: 'João Pedro', email: 'joao@email.com', cidade: 'Rio de Janeiro'},
    {id: 6, nome: 'Yasmin Dias', email: 'yasmin@email.com', cidade: 'São Paulo'}
  ];
  await knex('clientes').insert(clientes);
  console.log('Dados inseridos na tabela: clientes');


  // C) PRODUTOS (Depende de Marcas)
  // Os IDs de 1 a 18 são usados, e id_marca refere-se aos IDs inseridos acima.
  const produtos = [
    {id: 1, nome: 'iPhone 15 Pro Max', preco: 9999.00, estoque: 160, id_marca: 1},
    {id: 2, nome: 'iPhone 15 Pro', preco: 8599.00, estoque: 200, id_marca: 1},
    {id: 3, nome: 'iPhone 15', preco: 7299.00, estoque: 300, id_marca: 1},
    {id: 4, nome: 'iPhone SE', preco: 4599.00, estoque: 100, id_marca: 1},
    {id: 5, nome: 'Samsung Galaxy S23 Ultra', preco: 7599.00, estoque: 180, id_marca: 2},
    {id: 6, nome: 'Samsung Galaxy S23', preco: 5999.00, estoque: 250, id_marca: 2},
    {id: 7, nome: 'Samsung Galaxy A54', preco: 2199.00, estoque: 400, id_marca: 2},
    {id: 8, nome: 'Samsung Galaxy Z Fold 5', preco: 12999.00, estoque: 50, id_marca: 2},
    {id: 9, nome: 'Samsung Galaxy Z Flip 5', preco: 7999.00, estoque: 80, id_marca: 2},
    {id: 10, nome: 'Xiaomi 13 Pro', preco: 6599.00, estoque: 120, id_marca: 3},
    {id: 11, nome: 'Xiaomi 13', preco: 5899.00, estoque: 150, id_marca: 3},
    {id: 12, nome: 'Xiaomi Redmi Note 12 Pro', preco: 2299.00, estoque: 350, id_marca: 3},
    {id: 13, nome: 'Xiaomi Poco F5 Pro', preco: 3999.00, estoque: 200, id_marca: 3},
    {id: 14, nome: 'Xiaomi Redmi 12', preco: 1299.00, estoque: 500, id_marca: 3},
    {id: 15, nome: 'Huawei P60 Pro', preco: 8299.00, estoque: 90, id_marca: 4},
    {id: 16, nome: 'Huawei Nova 11 Pro', preco: 4999.00, estoque: 110, id_marca: 4},
    {id: 17, nome: 'Huawei Mate X3', preco: 14999.00, estoque: 40, id_marca: 4},
    {id: 18, nome: 'Huawei Pura 70 Ultra', preco: 11999.00, estoque: 60, id_marca: 4}
  ];
  await knex('produtos').insert(produtos);
  console.log('Dados inseridos na tabela: produtos');


  // D) PEDIDOS (Depende de Clientes)
  // Os campos valor_total no CSV estavam sem as casas decimais (ex: 11898 em vez de 11898.00).
  // Ajustamos aqui para o formato correto DECIMAL.
  const pedidos = [
    {id: 1, data_pedido: '2025-09-17', cliente_id: 1, valor_total: 11898.00},
    {id: 2, data_pedido: '2025-09-17', cliente_id: 2, valor_total: 13598.00},
    {id: 3, data_pedido: '2025-09-17', cliente_id: 3, valor_total: 12498.00},
    {id: 4, data_pedido: '2025-09-17', cliente_id: 4, valor_total: 5298.00}
  ];
  await knex('pedidos').insert(pedidos);
  console.log('Dados inseridos na tabela: pedidos');


  // E) ITENS_PEDIDO (Depende de Pedidos e Produtos)
  // O campo preco_unitario no CSV estava sem as casas decimais (ex: 7299 em vez de 7299.00).
  // Ajustamos aqui para o formato correto DECIMAL.
  const itens_pedido = [
    {id_pedido: 1, id_produto: 3, quantidade: 1, preco_unitario: 7299.00},
    {id_pedido: 1, id_produto: 4, quantidade: 1, preco_unitario: 4599.00},
    {id_pedido: 2, id_produto: 5, quantidade: 1, preco_unitario: 7599.00},
    {id_pedido: 2, id_produto: 6, quantidade: 1, preco_unitario: 5999.00},
    {id_pedido: 3, id_produto: 10, quantidade: 1, preco_unitario: 6599.00},
    {id_pedido: 3, id_produto: 11, quantidade: 1, preco_unitario: 5899.00},
    {id_pedido: 4, id_produto: 13, quantidade: 1, preco_unitario: 3999.00},
    {id_pedido: 4, id_produto: 14, quantidade: 1, preco_unitario: 1299.00}
  ];
  await knex('itens_pedido').insert(itens_pedido);
  console.log('Dados inseridos na tabela: itens_pedido');
};