const bcrypt = require('bcrypt');

const usuarios = [];

exports.cadastrar = async (usuario, senha) => {
    const hash = await bcrypt.hash(senha, 10);
    usuarios.push({ usuario, senhaHash: hash });
};

exports.login = async (usuario, senha) => {
    const user = usuarios.find(u => u.usuario === usuario);
    if (!user) return false;

    return await bcrypt.compare(senha, user.senhaHash);
};