const shopModel = require("../models/shop.model")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getInfoData, generateToken } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenErrod, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const keytokenModel = require("../models/keytoken.model")
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {
    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            //decode token
            const { userId, email } = await verifyJWT(refreshToken, foundToken.publicKey)
            console.log({ userId, email })
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happing!! Please login')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)

        if (!holderToken) throw new AuthFailureError('Shop not registerd')

        const { userId, email } = await verifyJWT(refreshToken, holderToken.publicKey)

        const foundShop = await findByEmail({ email })

        if (!foundShop) throw new AuthFailureError({ message: 'Shop not registered' })

        const token = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        await holderToken.updateOne({
            $set: {
                refreshToken: token.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user: { userId, email },
            token
        }

    }

    static handlerRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {

        const { userId, email } = user

        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something wrong happing!! Please login')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registerd')

        const foundShop = await findByEmail({ email })

        if (!foundShop) throw new AuthFailureError({ message: 'Shop not registered(email)' })

        const token = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
        console.log(keyStore)
        await keytokenModel(keyStore).updateOne({
            $set: {
                refreshToken: token.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })

        return {
            user,
            token
        }

    }

    static signUp = async ({ name, email, password }) => {
        console.log('AAAAAAAA')
        if (!name || !email || !password) {
            throw new BadRequestError('Required Param!!', 1001)
        }
        // step1  : check email exist
        const holderShop = await shopModel.findOne({ email }).lean()
        if (holderShop) {
            throw new BadRequestError('Error Shop is exist!!')
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