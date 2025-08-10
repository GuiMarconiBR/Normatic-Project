// Servidor com node.js express
const express = require('express'); // framework web para node.js
const mysql = require('mysql2');    // driver MySQL
const jwt = require('jsonwebtoken'); // biblioteca para gerar/verificar JWT
const bcrypt = require('bcryptjs'); // para criptografar e comparar senhas
const cors = require('cors'); // Para permitir requisições entre origens (frontend/backend separados)

const app = express(); // Cria app express
app.use(cors()); // permite cors para todas as origens (ajustar se quiser restringir)
app.use(express.json()); // para interpretar JSON nas requisições

const secret = '#4qnUc3$'; // chave secreta para assinar os tokens JWT - ALTERAR PARA CHAVE MAIS FORTE

// configurando a conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'normatic',
});

// Conecta o banco e lança erro se falhar
db.connect(err => {
    if (err) throw err;
    console.log('Conectado ao Banco de dados!');
});

// Rota POST /login para autenticar usuário e gerar token JWT
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body; // pega usuário e senha do corpo da requisição

    if (!usuario || !senha) { // verifica se os campos foram enviados
        return res.status(400).json({ message: 'Preencha usuario e senha!' });
    }

    // Consulta o banco para achar o usuário
    const sql = 'SELECT * FROM normatic_usuarios WHERE usuario = ?';

    db.query(sql, [usuario], async (err, results) => {
        if (err) return res.status(500).json({ message: 'Erro no servidor - Erro na consulta' }); // Erro na consulta

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }

        const user = results[0]; // Pega o primeiro usuário encontrado (único esperado)

        // Validação da senha usando bcrypt (para senhas criptografadas no banco)
        // const senhaValida = await bcrypt.compare(senha, user.senha);
        // if (!senhaValida) {
        //     return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        // }

        // Se a senha NÃO estiver criptografada, comente o bloco acima e descomente este:
        
        if (senha !== user.senha) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos' });
        }
        

        // Gera um token JWT com id e usuário, expira em 2 horas
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario },
            secret,
            { expiresIn: '2h' }
        );

        res.json({ token });
    });
});

// middleware para proteger rotas que precisam de autenticação
function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization']; // pega o header authorization

    // Aqui o split deve ser por espaço para separar "Bearer" do token
    const token = authHeader && authHeader.split(' ')[1]; // O formato esperado é "Bearer token"

    if (!token)
        return res.status(401).json({ message: 'Token não fornecido' });

    // verifica se o token é válido e não expirou
    jwt.verify(token, secret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido' }); // Token inválido ou expirado
        req.user = user; // Adiciona os dados do usuário à requisição para usar depois
        next(); // Continua para a rota protegida
    });
}

// Exemplo de rota protegida
app.get('/dados/protegidos', autenticarToken, (req, res) => {
    // Aqui só entra se o token for válido
    res.json({ message: `Bem-vindo, ${req.user.usuario}`, dados: [1, 2, 3] });
});

// inicia o servidor na porta 3000
app.listen(3000, () => console.log('API rodando na porta 3000'));

//----------------------------------------Código abaixo antigo para comparar--------------------------------------------------------------
// // Servidor com node.js express
// const express = require('express'); //framework web para node.js
// const mysql = require('mysql2');    //driver MySQL
// const jwt = require('jsonwebtoken') //biblioteca para gerar/verificar JWT
// const bcrypt = require('bcryptjs') //para criptografar e comparar senhas
// const cors = require('cors') //Para permitir requisições entre origens (frontend/backend separados)

// const app = express(); //Cria app express
// app.use(cors()); //permite cors para todas as origens (ajustar se eu quiser restringir)
// app.use(express.json()); //para interpretar JSON nas requisições

// const secret = '#4qnUc3$'; //chave secreta para assinar os tokens JWT - ALTERAR PARA CHAVE MAIS FORTE

// //configurando a conexão com o banco de dados
// const db = mysql.createConnection({
//     host:'localhost', 
//     user:'root',    
//     password:'root',
//     database:'normatic',
// });

// //Conecta o banco e lança erro se falhar
// db.connect(err => {
//     if(err) throw err;
//     console.log('Conectado ao Banco de dados!')
// });

// //Rota POST /login para autenticar usuário e gerar token JWT
// app.post('/login', (req, res) => {
//     const {usuario, senha} = req.body; //pega usuário e senha do corpo da requisição

//     if(!usuario || !senha) { //verifica se os campos foram enviados
//         return res.status(400).json({message: 'Preencha usuario e senha!'});
//     }

//     //Consulta o banco para achar o usuário
//     const sql = 'select * from normatic_usuarios where usuario = ?';

//     db.query(sql, [usuario], async (err, results) => {
//         if (err) return res.status(500).json({message: 'Erro no servidor'}); //Erro na consulta

//         if (results.length === 0) {
//             return res.status(401).json({message:'Usuário ou senha inválidos'});
//         }

//         //Gera um token JWT com id e usuário, expira em 2 horas
//         const token = jwt.sign(
//             {id: user.id, usuario: user.usuario},
//             secret,
//             {expiresIn: '2h'}
//         );

//         res. json({token});
//     });
// });

// //middleware para proteger rotas que precisam de autenticação
// function autenticarToken(req, res, next) {
//     const authHeader = req.headers['authorization']; //pega o header authorization
//     const token = authHeader && authHeader.split('')[1]; //O formato esperado é Bearer token

//     if(!token)
//         return res.status(401).json({message:'Token não fornecido'});

//     //verifica se o token é valido e não expirou
//     jwt.verify(token, secret, (err, user) => {
//         if(err) return res.status(403).json({message:'Token inválido'}) // Token inválido ou expirado
//         req.user = user; // Adiciona os daodos do usuário á requisição para usar depois
//         next(); // Continua para a rota protegida
//     });
// }

// //Exemplo de rota protegida
// app.get('/dados/protegidos', autenticarToken, (req, res) => {
//     //Aqui só entra se o token for válido
//     res.json({message: `Bem-vindo, ${req.user.usuario}`, dados: [1, 2, 3]});
// });

// //inicia p servidor na porta 3000 
// app.listen(3000, () => console.log('API rodando na porta 3000'));