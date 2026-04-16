const express = require('express');
const app = express();
const PORT = 3000;

const auth = require('./auth');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/painel', (req, res) => {
    res.sendFile(__dirname + '/views/painel.html');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/views/cadastro.html');
});

app.post('/cadastro', (req, res) => {
    const { usuario, senha } = req.body;

    auth.cadastrar(usuario, senha);

    res.send("Usuário cadastrado");
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    const user = auth.login(usuario, senha);

    if (user) {
        res.redirect('/painel');
    } else {
        res.send("Erro no login");
    }
});


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});