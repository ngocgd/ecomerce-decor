'use strict';


const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async({userId,publicKey})=>{
        try{
            const publicKeyString = publicKey.toString('base64')
            const token = await keytokenModel.create({
                user : userId,
                publicKey : publicKeyString
            })
            return token?token.publicKey : null
        }catch(e){
            return e
        }
    }
}
module.exports = KeyTokenService