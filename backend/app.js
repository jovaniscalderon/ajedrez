require("dotenv").config();
const express = require('express');
const cors = require("cors");
const app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
const { v4: uuidv4 } = require("uuid");
const { createClient } = require("yappy-node-back-sdk");

const { PlayerModel } = require("./models");

const {
    PORT = 3000,
    MONGODB_URI = "mongodb://admin:password@localhost:27017/chess?authSource=admin",
} = process.env;

let yappyClient = createClient(process.env.MERCHANT_ID, process.env.SECRET_KEY);

const payment = {
    total: null,
    subtotal: null,
    shipping: 0.0,
    discount: 0.0,
    taxes: null,
    orderId: null,
    successUrl: href="/frontend/success.html",
    failUrl: href="/frontend/error.html",
    tel: process.env.TEL || "66666666",
    domain: process.env.DOMAIN || "https://yappy.peqa.dev",
};

const db = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

//Inicio bloque de middleware
var corsOptions = {
    credentials: true,
    origin: true
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
//Fin bloque de middleware

function isAuthenticated (req, res, next) {
    if (req.session.user){
        next();
    }else{
        let cod = "UNAUTHORIZED";
        let message = "Debe iniciar session";
        res.json({ error: {cod, message}, succes: false });
    };
}

app.get('/', isAuthenticated, (req, res) => {
    let output = '<h1>Ajedrez Backend</h1>';
    output += '<h2>Proyecto Final de Desarrollo de Software IX</h2>';
    res.send(output);
});

app.get('/validateSession', isAuthenticated, async (req, res) => {
    let id = req.session.user;
    //Recupero usuario de la base de datos
    let playerRead = await PlayerModel.find({ id });
    if (playerRead.length) { //El usuario existe
        let { name, score, suscribed } = playerRead[0];
        //Salida para el cliente
        res.json({ 
            player: {
                id,
                name,
                score,
                suscribed
            }, 
            succes: true
        });
        return;
    }else{ //No existe el usuario
        cod = "UNAUTHORIZED";
        message = "Usuario no registrado";
    }
    res.json({ error: {cod, message}, succes: false });
});

app.post('/register', express.urlencoded({ extended: false }), async (req, res) => {
    //Inicializo variables
    let cod = "";
    let message = "";
    //Recupero parametros de entrada
    let id = req.body.id;
    let pass = req.body.pass;
    let score = req.body.score;
    let name = req.body.name;
    //Ejecuto validaciones
    if (req.session.user){
        cod = "REG_006";
        message = "Existe una session activa";
    }else{
        if(id === undefined || id === ""){
            cod = "REG_001";
            message = "Debe ingresar un nombre de usuario";
        }else{
            if(pass === undefined || pass === ""){
                cod = "REG_002";
                message = "Debe ingresar una contraseña";
            }else{
                if(score === undefined || score === ""){
                    cod = "REG_003";
                    message = "Debe ingresar un nivel de juego";
                }else{
                    if(name === undefined || name === ""){
                        cod = "REG_004";
                        message = "Debe ingresar su nombre completo";
                    }else{
                        //Verifico si ya existe usuario
                        let playerRead = await PlayerModel.find({ id });
                        if (playerRead.length) {
                          cod = "REG_005";
                          message = "Usuario ya existe";
                        }else{
                            //Inserto en la base de datos
                            const playerCreated = await PlayerModel.create({
                                id: id,
                                password: pass,
                                name: name,
                                score: score,
                                suscribed: false
                            });
                            //Inicio la session del usuario
                            req.session.user = playerCreated.id;
                            //Salida para el cliente
                            res.json({ 
                                player: {
                                    id: playerCreated.id,
                                    name: playerCreated.name,
                                    score: playerCreated.score,
                                    suscribed: playerCreated.suscribed
                                }, 
                                succes: true 
                            });
                            return;
                        }
                    }
                }
            }
        }
    }
    res.json({ error: {cod, message}, succes: false });
});

app.post('/login', express.urlencoded({ extended: false }), async (req, res) => {
    //Inicializo variables
    let cod = "";
    let message = "";
    //Recupero parametros de entrada
    let id = req.body.id;
    let pass = req.body.pass;
    //Ejecuto validaciones
    if (req.session.user){
        cod = "LOGIN_004";
        message = "Existe una session activa";
    }else{
        if(id === undefined || id === ""){
            cod = "LOGIN_001";
            message = "Debe ingresar un nombre de usuario";
        }else{
            if(pass === undefined || pass === ""){
                cod = "LOGIN_002";
                message = "Debe ingresar una contraseña";
            }else{
                //Recupero usuario de la base de datos
                let playerRead = await PlayerModel.find({ id });
                if (playerRead.length) { //El usuario existe
                    let { password, name, score, suscribed } = playerRead[0];
                    if(pass === password){ //La contraseña es valida
                        //Inicio la session del usuario
                        req.session.user = id;
                        //Salida para el cliente
                        res.json({ 
                            player: {
                                id,
                                name,
                                score,
                                suscribed
                            }, 
                            succes: true
                        });
                        return;
                    }else{ //La contraseña es invalida
                        cod = "LOGIN_003";
                        message = "Usuario o contraseña invalido";
                    }
                }else{ //No existe el usuario
                    cod = "LOGIN_003";
                    message = "Usuario o contraseña invalido";
                }
            }
        }
    }
    res.json({ error: {cod, message}, succes: false });
});

app.get('/logout', function (req, res, next) {
    if (req.session.user){
        //Finalizo la session del usuario
        req.session.user = null;
        req.session.save(function (err) {
        if (err) next(err);
        req.session.regenerate(function (err) {
            if (err) next(err);
            //Salida para el cliente
            res.json({ 
                response: {
                    cod: 'LOGOUT', 
                    message: 'Session Cerrada'
                }, 
                succes: true 
            });
        });});
    }else{
        //La session no existe
        res.json({ 
            response: {
                cod: 'LOGOUT_001', 
                message: 'No existe session de usuario'
            }, 
            succes: false
        });
    }
});

app.post("/api/pagosbg", async (req, res) => {
    const { price: subtotal } = req.body;
    const uuid = uuidv4();
    const taxes = Number((subtotal * 0.07).toFixed(2));
    const total = subtotal + taxes;
    const newPayment = {
      ...payment,
      subtotal: 0.01, // Para evitar tener que pagar durante la prueba
      taxes: 0.01, // Para evitar tener que pagar durante la prueba
      total: 0.02, // Para evitar tener que pagar durante la prueba
      orderId: uuid.split("-").join("").slice(0, 10),
    };
    const response = await yappyClient.getPaymentUrl(newPayment);
    res.json(response);
});

app.post('/subscribe', isAuthenticated, express.urlencoded({ extended: false }), async (req, res) => {
    let id = req.session.user;
    //Recupero usuario de la base de datos
    let playerRead = await PlayerModel.find({ id });
    if (playerRead.length) { //El usuario existe
        let { name, score, suscribed } = playerRead[0];
        if(suscribed){ //El ususario ya esta suscrito
            cod = "SCBE_001";
            message = "Usuario ya esta suscrito";
        }else{
            await PlayerModel.updateOne({ id }, {
                $set: {
                    suscribed: true
                }
            });
            //Salida para el cliente
            res.json({ 
                player: {
                    id: id,
                    name: name,
                    score: score,
                    suscribed: true
                }, 
                succes: true 
            });
            return;
        }
    }else{
        cod = "SCBE_002";
        message = "Usuario no registrado";
    }
    res.json({ error: {cod, message}, succes: false });
});

db.then(() => {
    console.log("Database connection established successfully");
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}).catch((error) => {
    console.error({ error });
});