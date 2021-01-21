'use strict';

import { isConstructorDeclaration } from 'typescript';  //no se que hace esto
import { User } from '../models/User';
const sss = require('shamirs-secret-sharing')

//generarsecrets() por si necesitamos generar nuevos secretsharings

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
let julen = new User("julen", "", 30)
julen.setPassword("clavejulen")
let harjot = new User("harjot", "", 30)
harjot.setPassword("claveharjot")
let listsecret = [julen, harjot]


async function login1(req, res) {

  let usuario = req.body;
  console.log("username body: " + usuario.username)
  console.log("contraseña body :" + usuario.password)
  user = await listusers.find(x => x.username == usuario.username)
  console.log(user)
  console.log("Se intenta logear el usuario " + usuario.username) //el que escribo ahora no el que ya tengo en la db

  if (!user) {
    return res.status(404).send({ message: 'Usuario no encontrado' })
  }

  else if (user.validatePassword(usuario.password)) { //la primera contraseña es como se llama en la db y la segunda la del json
    console.log("llega? ");
    let jwt = user.generateJWT();
    console.log("su nombre es:" + user.username)
    return res.status(200).json({ jwt: jwt, username: user.username }); //lo que se pone en el json
  }
  else {
    res.status(402).send({ message: 'Incorrect password' })
  }

}


async function login2shared(req, res) {

  let recovered;
  try {
    const shares = req.body.shares;
    console.log([shares[0], shares[1], shares[2], shares[3]])
    let i = 0;

    while (i < 4) {
      if (shares[i] == undefined || shares[i] == "") {
        shares.splice(i, 1)
        console.log(shares)
        if (shares.length <= i) {
          i = 6;   //numero cualquiera mayor que el lenght del shares[] para que se salga del while
        }
      }
      else {
        i++;
      }
    }

    if (shares.length > 1) {
      console.log("recovered")
      recovered = sss.combine([shares[0], shares[1]])//, shares[2], shares[3]])
      console.log(recovered)
    }
    else {
      recovered = "te faltan claves por poner"
    }
    console.log(recovered.toString()) // 'secret key' 
  }

  catch (err) {
    console.log(err)
    res.status(500).send({ message: "Some input incorrect" })
  }

  let usuario = req.body;
  console.log("username body: " + usuario.username)
  user = await listsecret.find(x => x.username == usuario.username)
  console.log(user)
  console.log("Se intenta logear el usuario " + usuario.username) //el que escribo ahora no el que ya tengo en la db

  if (!user) {
    return res.status(404).send({ message: 'Usuario no encontrado' })
  }

  else if (user.validatePassword(recovered)) { //la primera contraseña es como se llama en la db y la segunda la del json
    console.log("llega? ");
    let jwt = user.generateJWT();
    console.log("su nombre es:" + user.username)


    return res.status(200).json({ jwt: jwt, username: user.username }); //lo que se pone en el json
  }
  else {
    res.status(402).send({ message: 'Incorrect password' })
  }

}

async function getuser() {
  return user
}

async function gettienda() {  //esto no siempre será el dos depende de losm usuarios que tengamos
  return listusers[2]
}

function generarsecrets(){
  const secret = "claveharjot"
  const shares = sss.split(secret, { shares: 4, threshold: 2 })
  let i = 0                                          //Ya hemos generado las partes de la clave ya no nos hace falta
  while (i < 7){
    console.log(buf2hex(shares[i]))
    i++;
  }
}

function buf2hex(buffer) { // ArrayBuffer to hex
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}




module.exports = { login1, login2shared, getuser, gettienda };



