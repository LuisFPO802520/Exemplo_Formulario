const express = require('express');
const session = require('express-session');
const path = require('path');

const auth = require('./auth');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false
}));

function proteger(req, res, next) {
    if (req.session.user) next();
    else res.send("Faça login");
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/cadastro', (req, res) => {
    res.sendFile(__dirname + '/views/cadastro.html');
});

app.get('/painel', (req, res) => {
    res.sendFile(__dirname + '/views/painel.html');
});

// cadastro
app.post('/cadastro', async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.send("Preencha tudo");
    }

    await auth.cadastrar(usuario, senha);
    
    res.redirect('/');
});

// login
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.send("Preencha tudo");
    }

    const ok = await auth.login(usuario, senha);

    if (!ok) {
        return res.send(`
            <h1>Login inválido</h1>
            <a href="/">Voltar</a>
        `);
    }

    req.session.user = usuario;

    res.redirect('/painel');
});

// rota protegida
app.get('/painel', proteger, (req, res) => {
    res.send("Painel logado");
});


// logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});