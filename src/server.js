const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); 

// Rota de teste
app.get('/', (req, res) => {
  res.send('API de Pedidos e Marcas está ONLINE!');
});

// ============================================================================
// APENAS DE MARCA
// ============================================================================

// 1. READ (SELECT) - Listar todas as marcas
app.get('/marcas', async (req, res) => {
    try {
        const marcas = await db('marcas').select('*');
        return res.json(marcas);
    } catch (error) {
        console.error('Erro ao listar marcas:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao listar marcas.' });
    }
});

// 2. READ (SELECT) - Buscar uma marca por ID
app.get('/marcas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const marca = await db('marcas').where({ id }).first();

        if (!marca) {
            return res.status(404).json({ error: 'Marca não encontrada.' });
        }
        return res.json(marca);
    } catch (error) {
        console.error(`Erro ao buscar marca ${id}:`, error);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar marca.' });
    }
});

// 3. DELETE (DELETE) - Deletar marca por ID
app.delete('/marcas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Deleta o registro e retorna a contagem de linhas afetadas (1 ou 0)
        const count = await db('marcas').where({ id }).del();

        if (count === 0) {
            return res.status(404).json({ error: 'Marca não encontrada para exclusão.' });
        }

        return res.status(204).send(); // 204 No Content: Sucesso sem corpo de resposta
    } catch (error) {
        console.error(`Erro ao deletar marca ${id}:`, error);
        return res.status(500).json({ error: 'Erro interno do servidor ao deletar marca.' });
    }
});

// ============================================================================

// ============================================================================
// APENAS DE PRODUTOS
// ============================================================================

// 1. READ (SELECT) - Listar todos os produtos
app.get('/produtos', async (req, res) => {
    try {
        const produtos = await db('produtos')
            .select(
                'produtos.id',
                'produtos.nome',
                'produtos.preco',
                'produtos.estoque',
                'produtos.id_marca',
                'marcas.nome as nome_marca' // Adiciona o nome da marca
            )
            .join('marcas', 'produtos.id_marca', '=', 'marcas.id')
            .orderBy('produtos.id');

        return res.json(produtos);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao listar produtos.' });
    }
});

// 2. READ (SELECT) - Buscar um produto por ID
app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const produto = await db('produtos')
            .select(
                'produtos.*', // Seleciona todos os campos do produto
                'marcas.nome as nome_marca' // Adiciona o nome da marca
            )
            .join('marcas', 'produtos.id_marca', '=', 'marcas.id')
            .where('produtos.id', id)
            .first();

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }
        return res.json(produto);
    } catch (error) {
        console.error(`Erro ao buscar produto ${id}:`, error);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar produto.' });
    }
});

// 3. CREATE (INSERT) - Criar novo produto
app.post('/produtos', async (req, res) => {
    const novoProduto = req.body;
    
    // Validação de Chave Estrangeira e dados obrigatórios
    if (!novoProduto.nome || !novoProduto.preco || !novoProduto.id_marca) {
        return res.status(400).json({ error: 'Os campos nome, preco e id_marca são obrigatórios.' });
    }

    try {
        // 1. Verifica se a marca existe (Integridade Referencial)
        const marcaExiste = await db('marcas').where('id', novoProduto.id_marca).first();
        if (!marcaExiste) {
            return res.status(400).json({ error: 'ID da marca fornecido não existe.' });
        }

        // 2. Insere o produto
        const [id] = await db('produtos').insert(novoProduto);
        
        // 3. Retorna o produto criado (com o nome da marca para confirmação)
        const produtoCriado = await db('produtos')
            .select('produtos.*', 'marcas.nome as nome_marca')
            .join('marcas', 'produtos.id_marca', '=', 'marcas.id')
            .where('produtos.id', id)
            .first();

        return res.status(201).json(produtoCriado);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao criar produto.' });
    }
});

// ============================================================================
// APENAS DE CLIENTES
// ============================================================================

// 1. READ (SELECT) - Listar todos os clientes
app.get('/clientes', async (req, res) => {
    try {
        const clientes = await db('clientes').select('*');
        return res.json(clientes);
    } catch (error) {
        console.error('Erro ao listar clientes:', error);
        return res.status(500).json({ error: 'Erro interno do servidor ao listar clientes.' });
    }
});

// 2. READ (SELECT) - Buscar um cliente por ID
app.get('/clientes/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cliente = await db('clientes').where({ id }).first();

        if (!cliente) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }
        return res.json(cliente);
    } catch (error) {
        console.error(`Erro ao buscar cliente ${id}:`, error);
        return res.status(500).json({ error: 'Erro interno do servidor ao buscar cliente.' });
    }
});

// 3. CREATE (INSERT) - Cadastrar novo cliente
app.post('/clientes', async (req, res) => {
    const novoCliente = req.body;
    
    // Validação de dados obrigatórios
    if (!novoCliente.nome || !novoCliente.email || !novoCliente.cidade) {
        return res.status(400).json({ error: 'Os campos nome, email e cidade são obrigatórios.' });
    }

    try {
        // Opcional: Verifica se o email já está em uso
        const emailExistente = await db('clientes').where('email', novoCliente.email).first();
        if (emailExistente) {
            return res.status(400).json({ error: 'Este endereço de email já está cadastrado.' });
        }

        const [id] = await db('clientes').insert(novoCliente);
        
        // Retorna o cliente criado
        const clienteCriado = await db('clientes').where({ id }).first();

        return res.status(201).json(clienteCriado);
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        // Erro 500 pode ocorrer se, por exemplo, o campo 'email' for UNIQUE e falhar
        return res.status(500).json({ error: 'Erro interno do servidor ao criar cliente.' });
    }
});

// ============================================================================
// APENAS DE PEDIDOS
// ============================================================================

async function getPedidoDetalhado(pedidoId) {
    // 1. Busca os dados do pedido e do cliente
    const pedido = await db('pedidos')
        .select(
            'pedidos.id',
            'pedidos.data_pedido',
            'pedidos.valor_total',
            'clientes.id as cliente_id',
            'clientes.nome as nome_cliente',
            'clientes.cidade as cidade_cliente',
            'clientes.email as email_cliente'
        )
        .join('clientes', 'pedidos.cliente_id', '=', 'clientes.id')
        .where('pedidos.id', pedidoId)
        .first();

    if (!pedido) {
        return null;
    }

    // 2. Busca todos os itens de pedido relacionados
    const itens = await db('itens_pedido')
        .select(
            'itens_pedido.id_produto',
            'itens_pedido.quantidade',
            'itens_pedido.preco_unitario',
            'produtos.nome as nome_produto',
            'produtos.preco as preco_atual_produto' // Preço do produto no estoque (para referência)
        )
        .join('produtos', 'itens_pedido.id_produto', '=', 'produtos.id')
        .where('itens_pedido.id_pedido', pedidoId);

    // 3. Formata e retorna o pedido com os itens aninhados
    pedido.itens = itens;
    return pedido;
}

const db = require('./db/connection');

