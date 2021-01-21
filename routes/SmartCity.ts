"use strict";

import express = require("express");
let router = express.Router();
let loginControl = require('../controllers/loginControl');
let bancoControl = require('../controllers/bancoControl');

///////////////////////////////login/////////////////////////////
router.post('/login1', loginControl.login1);  
router.post('/login2shared', loginControl.login2shared);

///////////////////////////////funciones del banco/////////////////////////////
router.get('/publickeyBanco', bancoControl.getPublicKeyRSAbanco);   //le paso la publicKey del server (banco) al client
router.post('/getDinero', bancoControl.get1Euro);   //el cliente me pide una cantidad de dinero y yo lo firmo
router.post('/verificaridmoneda', bancoControl.verificaridmoneda);  //el banco le pasa las monedas firmadas  al banco que le ha dado el cliente al banco y las tiene que verificar



module.exports = router;