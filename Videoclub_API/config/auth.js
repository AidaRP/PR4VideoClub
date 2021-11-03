module.exports = {
    secret: process.env.AUTH_SECRET || "$1b4yg7832t7h28R%DRgt", //Key usada para la encriptación.
    expires: process.env.AUTH_EXPIRES || "24h", //Permanencia del Token.
    rounds: process.env.AUTH_ROUNDS || 13 //Número de veces que la contraseña se encripta.
}