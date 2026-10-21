
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

const banco = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get('/', (req, res) => {
    res.send('Acessaí está funcionando!');
});

app.get('/teste-banco', async (req, res) => {
    try {
        const conexao = await banco.getConnection();

        conexao.release();

        res.send('Conexão com o MySQL funcionando!');
    } catch (erro) {
        console.error(erro.message);

        res.status(500).send('Erro ao conectar com o MySQL.');
    }
});

app.get('/locais', async (req, res) => {
    try {
        const [dados] = await banco.query('SELECT * FROM locais');

        res.json(dados);
    } catch (erro) {
        console.error(erro.message);

        res.status(500).json({
            erro: 'Não foi possível consultar os locais.'
        });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});

