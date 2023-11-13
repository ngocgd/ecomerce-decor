const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
            console.log('new_logggggggggg',{ name, email, password })
            if(!name || !email || !password){
                throw new BadRequestError('Required Param!!',1001)
            }
            // step1  : check email exist
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error Shop is not exist!!')
            }
            // console.log('kkkkkkk',holderShop)
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                email, name, password: passwordHash, roles: [RoleShop.SHOP]
            })
            console.log('kkkkkkk', newShop)
            if (newShop) {
                const { publicKey, privateKey } = await crypto.generateKeyPairSync("rsa", {
                    modulusLength: 4096,
                    publicKeyEncoding : {
                        type : 'pkcs1',
                        format : 'pem'
                    },
                    privateKeyEncoding : {
                        type : 'pkcs1',
                        format : 'pem'
                    }
                })
                // console.log(publicKey, privateKey)
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey
                })
                if (!publicKeyString) {
                    return {
                        code: 'errorxxx',
                        message: 'error publicKeyString'
                    }
                }
                const publicKeyObject = crypto.createPublicKey(publicKeyString)
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log('Create Token successs  :::', tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData(['email','_id','name'],newShop),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
    }
}

module.exports = AccessService