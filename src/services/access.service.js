const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData, generateToken } = require("../utils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static signUp = async ({ name, email, password }) => {
        if (!name || !email || !password) {
            throw new BadRequestError('Required Param!!', 1001)
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
        if (newShop) {
            const tokens = await generateToken({ shop_id: newShop._id, email })
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey: tokens.publicKey,
                privateKey: tokens.privateKey,
            })
            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keystore error'
                }
            }
            return {
                code: 201,
                metadata: {
                    shop: getInfoData(['email', '_id', 'name'], newShop),
                    tokens
                }
            }
        }
        return {
            code: 200,
            metadata: null
        }
    }

    static login = async ({ email, password, refreshToken }) => {
        const shopData = await findByEmail({ email })
        if (!shopData) throw new BadRequestError('Shop not registered')

        const match = bcrypt.compare(password, shopData.password)
        if (!match) {
            throw new AuthFailureError('Authentication error')
        }
        //generate token
        const tokens = await generateToken({ shop_id: shopData._id, email })
        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey: tokens.privateKey,
            publicKey: tokens.publicKey,
            userId: shopData._id
        })
        return {
            shop: getInfoData(['email', '_id', 'name'], shopData),
            tokens
        }
    }
    static logout = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyToken(keyStore.id)
        console.log(delKey)
        return delKey
    }
}

module.exports = AccessService