const usuarios = [];

exports.cadastrar = (usuario, senha) => {
    usuarios.push({ usuario, senha });
};

exports.login = (usuario, senha) => {
    return usuarios.find(u => u.usuario === usuario && u.senha === senha);
};