module.exports = {
    secret: process.env.AUTH_SECRET || "$1b4yg7832t7h28R%DRgt", //KEY USADA PARA ENCRIPTAR
    expires: process.env.AUTH_EXPIRES || "24h", //DURACIÓN DEL TOKEN
    rounds: process.env.AUTH_ROUNDS || 10 //VECES QUE SE ENCRIPTA LA CONTRASEÑA
}