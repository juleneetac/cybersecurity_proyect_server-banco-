'use strict';
import crypto = require('crypto');
import { isConstructorDeclaration } from 'typescript';
import { PublicKey } from '../rsa/publicKey';
const bc = require('bigint-conversion');
import { RSA as classRSA } from "../rsa/rsa";
import * as objectSha from 'object-sha'
import { bigintToHex, bigintToText, hexToBigint, textToBigint } from 'bigint-conversion';
import { Console } from 'console';
import { executionAsyncId } from 'async_hooks';
import e = require('express');
let loginControl = require('../controllers/loginControl');
const got = require('got');
const sss = require('shamirs-secret-sharing')
var fs = require("fs");
let usadas;
let rsa = new classRSA;
let tienda;

execrsa()   //ejecuta el generateRandomKeys() al iniciarse el program para tener las claves para todo el rato
/* pruebafuncionaverify()
async function pruebafuncionaverify(){
  let idusadas;
  let splitted= [];
  let split=[]

  idusadas= fs.readFileSync("usedids.txt", function(err, buf) {
  if (err) { console.log(err) }
  console.log(buf.toString());
  //split= idusadas.split(",")
}); 
idusadas = idusadas.toString()
splitted = idusadas.split("\n")
splitted.forEach(element => {
  if("508c8667af7470def881c84112ccfd3dd1b1692f802347eb1aaa826eb70e676c"===element)
  {
    console.log(element)
    return "encontrado"
  }
});

}  */
////////////////////////////////////////  RSA   ////////////////////////////////////////////

async function getPublicKeyRSAbanco(req, res) {

  try {
    //keyPair = await rsa.generateRandomKeys(); //NO PONER this.

    res.status(200).send({
      e: await bc.bigintToHex(rsa.publicKey.e),
      n: await bc.bigintToHex(rsa.publicKey.n)
    })
  }
  catch (err) {
    console.log("error recibiendo la public key" + err)
    res.status(500).send({ message: err })
  }
}


/////////////////////////////////////////RSA+FIRMA CIEGA(dar el dinero que me pide el cliente)///////////////////////////////////////////////////

async function get1Euro(req, res) {   // aquí el servidor firma lo que le llega pero sin saber que es lo que le ha llegado y lo devuelve firmado
  try {                                    //esto lo hará el banco
    const m = []; //= bc.hexToBigint(req.body.firmame);
    let signedbm = [];
    let signedbmhex = [];
    let i = 0;
    while (i < req.body.firmame.length) {
      m[i] = bc.hexToBigint(req.body.firmame[i]);  //si llega OK
      signedbm[i] = rsa.privateKey.sign(m[i])
      signedbmhex[i] = bc.bigintToHex(signedbm[i])  // convertir a hezadecimal
      i++;
    }
    //const signedbm = rsa.privateKey.sign(m
    let user = await loginControl.getuser()
    console.log(user)
    if (user.money >= m.length)  // esto es para mirar si tiene suficiente y quitar si tiene de su banco
    {
      user.money = user.money - m.length
      console.log("Al user "+ user.username + " le queda: " + user.money + " €")
      res.status(200).send({ msg: signedbmhex })
    }
    else {
      console.log("pobre detectado")
      res.status(203).send({ msg: "trabaja mas vago" }) //ojo no cambiar mensaje ojo
    }

  }
  catch (err) {
    console.log(err)
    res.status(500).send({ message: err })
  }
}


async function verificaridmoneda(req, res) {
  try {
    let verificame = req.body.verificame //esto es la moneda firmada(array de 1€)
    let cantidad: number = req.body.cantidad  //esto es la cantidad de dinero(que sera igual al length del array)
    let verified = req.body.verified
    let y = 0;
    let idusadas;
    let splitted = [];
    let repetida = 0 //si0 no repe si 1 si repe
    idusadas = fs.readFileSync("usedids.txt", function (err, buf) {
      if (err) { console.log(err) }
      //split= idusadas.split(",")
    });
    idusadas = idusadas.toString()
    splitted = idusadas.split("\n")
    //esto lo hará el banco
    while (y < verificame.length) {
      verificame[y] = bc.bigintToText(rsa.publicKey.verify(bc.hexToBigint(verificame[y])))  //esto ,lo hara la tienda que es quien verifique la moneda
      if (verificame[y] !== verified[y]) {
        console.log(verified[y])
        console.log(verificame[y])
        return res.status(201).send({ msg: "Integridad de la moneda no verificada" })
      }
      else {
        splitted.forEach(element => {
          if (verified[y] === element) {
            console.log(element)
            repetida = 1
            return res.status(202).send({ msg: "Moneda repetida" })
          }
        });
        if (repetida == 0) {
          let data = "\n" + verificame[y];

          fs.appendFile('usedids.txt', data, function (err) {
            if (err) throw err;
            console.log('Saved! la moneda se puso en un txt');
          });
          y++;
        }
      }
    }
    if ((repetida == 0) && (verificame[y] == verified[y])) { //si no ha habido error
          //const signedbm = rsa.privateKey.sign(m)
          tienda = await loginControl.gettienda()

          tienda.money = tienda.money + verified.length
          console.log("la tienda tiene este dinero " + tienda.money + " €")
          res.status(200).send({ msg: "ok verificacion" })
    }
       // }
     // }
      
    //}
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ message: err })
  }


}

////////////////////////////////////////  Cosas útiles   ////////////////////////////////////////////

async function execrsa() {   //genera las keyPair
  let keyPair = await rsa.generateRandomKeys();  //generqa keys RSA
  console.log("ok")
}

module.exports = {
  getPublicKeyRSAbanco,
  get1Euro,
  verificaridmoneda
};