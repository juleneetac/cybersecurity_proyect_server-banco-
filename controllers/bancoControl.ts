'use strict';
import crypto = require('crypto');
import { isConstructorDeclaration } from 'typescript';
import { PublicKey } from '../rsa/publicKey';
const bc = require('bigint-conversion');
import { RSA  as classRSA} from "../rsa/rsa";
import * as objectSha from 'object-sha'
import { bigintToHex, bigintToText, hexToBigint, textToBigint } from 'bigint-conversion';
import { Console } from 'console';
const got = require('got');
const sss = require('shamirs-secret-sharing')


let rsa  = new classRSA;


execrsa()   //ejecuta el generateRandomKeys() al iniciarse el program para tener las claves para todo el rato




  ////////////////////////////////////////  RSA   ////////////////////////////////////////////

async function getPublicKeyRSA(req, res) {  

    try {
      //keyPair = await rsa.generateRandomKeys(); //NO PONER this.
      
      res.status(200).send({
        e: await bc.bigintToHex(rsa.publicKey.e),
        n: await bc.bigintToHex(rsa.publicKey.n)
      })
    }
    catch(err) {
      console.log("error recibiendo la public key"+ err)
      res.status(500).send ({ message: err})   
    }
  }


/////////////////////////////////////////RSA+FIRMA CIEGA(dar el dinero que me pide el cliente)///////////////////////////////////////////////////
  
   async function get1Euro(req, res) {   // aquí el servidor firma lo que le llega pero sin saber que es lo que le ha llegado y lo devuelve firmado
    try {                                    //esto lo hará el banco
      const m = bc.hexToBigint(req.body.firmame);
      let signedbm;
      let i = 0;
      while (i < m.length ){
        signedbm[i] = rsa.privateKey.sign(m[i])
        i++;
      }
      //const signedbm = rsa.privateKey.sign(m)

      res.status(200).send({msg: bc.bigintToHex(signedbm)})
    }
    catch(err) {
      res.status(500).send ({ message: err})
    }
  }




  ////////////////////////////////////////  Cosas útiles   ////////////////////////////////////////////

async function execrsa(){   //genera las keyPair
    let keyPair = await rsa.generateRandomKeys();  //generqa keys RSA
    console.log("ok")
  }

  module.exports = {
    getPublicKeyRSA, 
    get1Euro
  };