"use strict";

import express = require("express");
let router = express.Router();
let tiendaControl = require('../controllers/tiendaControl');
let loginControl = require('../controllers/loginControl');
let bancoControl = require('../controllers/bancoControl');

///////////////////////////////login/////////////////////////////
router.post('/login1', loginControl.login1);  
router.post('/login2shared', loginControl.login2shared);

router.get('/publickey', bancoControl.getPublicKeyRSA);   //le paso la publicKey del server (banco) al client
router.post('/getDinero', bancoControl.get1Euro);   //el cliente me pide una cantidad de dinero y yo lo firmo


///////////////////////////////AES/////////////////////////////
router.post('/addPost', tiendaControl.postCaso);   
router.get('/getFrase', tiendaControl.getFrase);  

///////////////////////////////RSA/////////////////////////////
router.post('/addPostRSA', tiendaControl.postCasoRSA);
router.post('/sign', tiendaControl.signMsgRSA);
router.get('/getFraseRSA', tiendaControl.getFraseRSA);
router.post('/postpubKey', tiendaControl.postpubKeyRSA);


///////////////////////////////FIRMA CIEGA/////////////////////////////      /postpaillierSum
router.post('/signCiega', tiendaControl.signMsgCiega);


/////////////////////////////// SECRET SHARING ///////////////////////////////////////////////
router.post('/postsecretsharing', tiendaControl.postSecretSharing);


module.exports = router;