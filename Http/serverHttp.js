const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const auth = require('./auth');

http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        fs.readFile(__dirname + "/index.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    // 🔥 NOVO
    else if (req.url === "/cadastro" && req.method === "GET") {
        fs.readFile(__dirname + "/cadastro.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    else if (req.url === "/cadastro" && req.method === "POST") {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const dados = querystring.parse(body);

            auth.cadastrar(dados.usuario, dados.senha);

            res.end("<h1>Cadastrado</h1><a href='/'>Voltar</a>");
        });
    }

    else if (req.url === "/login" && req.method === "POST") {
        let body = '';

        req.on('data', chunk => body += chunk);

        req.on('end', () => {
            const dados = querystring.parse(body);

            const ok = auth.login(dados.usuario, dados.senha);

            if (ok) {
                res.end("<a href='/painel'>Entrar no painel</a>");
            } else {
                res.end("Erro no login");
            }
        });
    }

    else if (req.url === "/painel" && req.method === "GET") {
        fs.readFile(__dirname + "/painel.html", (err, html) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(html);
        });
    }

    else {
        res.writeHead(404);
        res.end("Página não encontrada");
    }

}).listen(3000);