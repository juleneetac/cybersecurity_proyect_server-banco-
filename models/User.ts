
import jwt =  require ('jsonwebtoken');
import bcu = require ('bigint-crypto-utils');
import bc = require('bigint-conversion');
import crypto = require('crypto');

export class User {
  //imports
    

  //user attributes
    username: String;
    password: String;
    money: Number;
    hash: String ;
    salt: string;
    keysharing;

    constructor(username, hash, money) {
      this.username = username;
      this.hash = hash;
      this.money = money;
    }

    generateJWT (){
      const today = new Date();
      const expirationDate = new Date(today);
      const minutes = 60;
      expirationDate.setTime(today.getTime() + minutes*60000);
      return jwt.sign({
          username: this.username,
          exp: expirationDate.getTime() / 1000,
      }, 'secret');
  };

  
   setPassword(password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

  validatePassword (password) {
        console.log(this.salt);
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
};

  }

