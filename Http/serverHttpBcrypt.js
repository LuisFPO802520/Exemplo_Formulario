const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const auth = require('./auth');

// 🔹 pega cookie
function getCookie(req) {
    if (!req.headers.cookie) return null;

    const partes = req.headers.cookie.split('=');
    return partes[1];
}

http.createServer((req, res) => {

    // 🔹 HOME (login)
    if (req.url === "/" && req.method === "GET") {
        fs.readFile(__dirname + "/index.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    // 🔥 NOVO — PÁGINA DE CADASTRO
    else if (req.url === "/cadastro" && req.method === "GET") {
        fs.readFile(__dirname + "/cadastro.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    // 🔹 CADASTRO (POST)
    else if (req.url === "/cadastro" && req.method === "POST") {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', async () => {
            const dados = querystring.parse(body);
            const { usuario, senha } = dados;

            if (!usuario || !senha) {
                return res.end("Preencha todos os campos");
            }

            await auth.cadastrar(usuario, senha);

            res.end("<h1>Cadastrado com sucesso</h1><a href='/'>Voltar</a>");
        });
    }

    // 🔹 LOGIN
    else if (req.url === "/login" && req.method === "POST") {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', async () => {
            const dados = querystring.parse(body);
            const { usuario, senha } = dados;

            if (!usuario || !senha) {
                return res.end("Preencha todos os campos");
            }

            const ok = await auth.login(usuario, senha);

            if (!ok) return res.end("Usuário ou senha inválidos");

            // 🔐 cria cookie
            res.writeHead(200, {
                "Set-Cookie": "login=ok",
                "Content-Type": "text/html"
            });

            res.end("<a href='/painel'>Entrar no painel</a>");
        });
    }

    // 🔒 PAINEL PROTEGIDO
    else if (req.url === "/painel" && req.method === "GET") {

        const cookie = getCookie(req);

        if (cookie !== "ok") {
            return res.end("Acesso negado");
        }

        fs.readFile(__dirname + "/painel.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    // 🔴 LOGOUT
    else if (req.url === "/logout" && req.method === "GET") {

        res.writeHead(200, {
            "Set-Cookie": "login=; Max-Age=0",
            "Content-Type": "text/html"
        });

        res.end("<h1>Logout realizado</h1><a href='/'>Voltar</a>");
    }

    // 🔹 404
    else {
        res.writeHead(404);
        res.end("Página não encontrada");
    }

}).listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});