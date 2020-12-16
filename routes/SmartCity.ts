"use strict";

import express = require("express");
let router = express.Router();
let tiendaControl = require('../controllers/tiendaControl');
let loginControl = require('../controllers/loginControl');

///////////////////////////////login/////////////////////////////
router.post('/login1', loginControl.login1);  
router.post('/login2shared', loginControl.login2shared);

///////////////////////////////AES/////////////////////////////
router.post('/addPost', tiendaControl.postCaso);   
router.get('/getFrase', tiendaControl.getFrase);  

///////////////////////////////RSA/////////////////////////////
router.post('/addPostRSA', tiendaControl.postCasoRSA);
router.post('/sign', tiendaControl.signMsgRSA);
router.get('/getFraseRSA', tiendaControl.getFraseRSA);
router.post('/postpubKey', tiendaControl.postpubKeyRSA);
router.get('/publickey', tiendaControl.getPublicKeyRSA);  

///////////////////////////////FIRMA CIEGA/////////////////////////////      /postpaillierSum
router.post('/signCiega', tiendaControl.signMsgCiega);


/////////////////////////////// SECRET SHARING ///////////////////////////////////////////////
router.post('/postsecretsharing', tiendaControl.postSecretSharing);


module.exports = router;