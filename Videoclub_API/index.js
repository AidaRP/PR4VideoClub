const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const logger = require('./config/winston');
const db = require('./db.js');
const router = require('./router.js');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000; //Configuración del puerto de Heroku

var corsOptions = {//CONFIGURO OPCIONES DE CORS Configuración de ls opciones del CORS
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};

//Middleware -->Son las funciones que se ejecutarán SIEMPRE antes del cualquier acción que realicemos en la aplicación
app.use(morgan('combined', { stream: logger.stream }));//Género Logs
app.use(express.json()); //Obtención del JSON por el Body
app.use(cors(corsOptions));  //Utilización del cors

//Rutas
app.get('/', (req, res) => {res.send('Bienvenidos a nuestro VideoClub');}); //Vista de bienvenida en la vista inicial
app.use(router);

db.then(()=>{
        app.listen(PORT, ()=> console.log(`Server on port ${PORT}`.bgBlue.white)); //Iniciación/Arranque del servidor
    })
    .catch((err)=> console.log(err.message));   