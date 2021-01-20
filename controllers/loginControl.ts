'use strict';
import crypto = require('crypto');
import { isConstructorDeclaration } from 'typescript';
import { PublicKey } from '../rsa/publicKey';
const bc = require('bigint-conversion');
import { RSA  as classRSA} from "../rsa/rsa";
import * as objectSha from 'object-sha'
import { bigintToHex, bigintToText, hexToBigint, textToBigint } from 'bigint-conversion';
import { Console } from 'console';
import { User } from '../models/User';
const got = require('got');
const sss = require('shamirs-secret-sharing')

let algorithm = 'aes-256-cbc';
let key = '89a1f34a907ff9f5d27309e73c113f8eb084f9da8a5fedc61bb1cba3f54fa5de'
let keyBuf =Buffer.from(key, "hex")
let rsa  = new classRSA;
//let keyPair; //no se usa
//execrsa()   //ejecuta el generateRandomKeys() al iniciarse el program para tener las claves para todo el rato
let pubKeyClient:PublicKey;
let ttp;
let norepudioMessage;
let intID;
let ttpPubKey: PublicKey;
let ivc;

//users login normal
let user: User;
let alex = new User("alex", "", 30)
alex.setPassword("111")
let pep = new User("pep", "", 30)
pep.setPassword("222")
let tienda = new User("tienda", "", 0) //user de tienda
tienda.setPassword("777")
let listusers = [alex, pep, tienda]

//users login secret sharing
let jul = new User("jul", "", 30)
jul.setPassword("clavejulen")
let harjot = new User("harjot", "", 30)
harjot.setPassword("clavehar")
let listsecret = [jul, harjot]


async function login1 (req, res){
        
        let usuario = req.body;
        console.log("username body: " + usuario.username)
        console.log("contraseña body :" + usuario.password)
        user = await listusers.find(x => x.username == usuario.username)
        console.log(user)
        console.log("Se intenta logear el usuario " + usuario.username) //el que escribo ahora no el que ya tengo en la db

        if (!user) {
          return res.status(404).send({message: 'Usuario no encontrado'})
        } 

        else if(user.validatePassword(usuario.password)){ //la primera contraseña es como se llama en la db y la segunda la del json
            console.log("llega? ");
            let jwt = user.generateJWT();
            console.log("su nombre es:"+ user.username)
            return res.status(200).json({jwt: jwt, username: user.username}); //lo que se pone en el json
        }
        else {
          res.status(402).send({message: 'Incorrect password'})
        }
     // }
      //catch (err) {
      // res.status(503).send(err)
      //}
}


async function login2shared (req, res){

  let recovered;
  try {
    const shares = req.body.shares;
    console.log([shares[0], shares[1], shares[2], shares[3]])
    let i = 0;

    while(i < 4) {
      if (shares[i] == undefined  || shares[i] == ""){
        shares.splice(i, 1)
        console.log(shares)
        if(shares.length <= i ){
          i = 6;   //numero cualquiera mayor que el lenght del shares[] para que se salga del while
        }
      }
      else{
        i++;
      }
    }

    if (shares.length > 1){
      console.log("recovered")
      recovered = sss.combine([shares[0], shares[1]])//, shares[2], shares[3]])
      console.log(recovered)
    }
    else{
      recovered = "te faltas claves por poner"
    }
    console.log(recovered.toString()) // 'secret key' 
  }

  catch(err) {
    console.log(err)
    res.status(500).send ({ message: "Some input incorrect"})
  }

  let usuario = req.body;
        console.log("username body: " + usuario.username)
        user = await listsecret.find(x => x.username == usuario.username)
        console.log(user)
        console.log("Se intenta logear el usuario " + usuario.username) //el que escribo ahora no el que ya tengo en la db

        if (!user) {
          return res.status(404).send({message: 'Usuario no encontrado'})
        }

        else if(user.validatePassword(recovered)){ //la primera contraseña es como se llama en la db y la segunda la del json
            console.log("llega? ");
            let jwt = user.generateJWT();
            console.log("su nombre es:"+ user.username)
            
            
            return res.status(200).json({jwt: jwt, username: user.username}); //lo que se pone en el json
        }
        else {
          res.status(402).send({message: 'Incorrect password'})
        }

// }
//catch (err) {
// res.status(503).send(err)
//}
}

async function getuser(){
  return user
}
async function gettienda(){
  return listusers[2]
}




module.exports = {login1, login2shared, getuser,gettienda};



