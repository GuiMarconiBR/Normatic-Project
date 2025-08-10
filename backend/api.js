// Servidor com node.js express
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000; //porta onde a api vai rodar

// Configurar CORS para permitir requisições do frontend
app.use(cors({
    origin: 'https:localhost:5500' //dominio onde está rodando o frontend
}));

//para ler json no corpo da requisição
app.use(bodyParser.json());

//Criar conexão com o banco MySQL
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'normatic'
});

//endpoint para validar login
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({erro:'Usuário e senha são obrigatórios'});
    } 


    //consulta para buscar o usuário no banco
    const sql = 'select * from normatic_usuarios where usuario = ? limit 1';
    db.query(sql, [usuario], (err, results) => {
        if(err) {
            console.error(err);
            return res.status(500).json({erro:'Erro no servidor'});
        }

        if(results.length === 0) {
            return res.status(400).json({sucesso: false, mensagem:'Usuário nõ encontrado'});
        }

        const user = results[0];

        //Comparação de senha - deve ser feito em hash na versão final!
        if (senha === user.senha) {
            return res.json({sucesso: true, mensagem: 'Login realizado com sucesso'});
        } else {
            return res.status(401).json({sucesso: false, mensagem:'Senha incorreta'});
        }
    });
});

//iniciar servidor
app.listen(port, () => {
    console.log(`API rodando na porta ${port}`)
})


