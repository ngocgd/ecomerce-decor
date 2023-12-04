'use strict';


const { filter } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const { token } = require("morgan");
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //level0
            // const publicKeyString = publicKey.toString('base64')
            // const token = await keytokenModel.create({
            //     user : userId,
            //     publicKey : publicKeyString
            // })
            // return token?token.publicKey : null

            //level xx
            const filter = { user: userId },
                update = {
                    publicKey,
                    privateKey,
                    refreshTokenUsed: [],
                    refreshToken
                },
                options = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (e) {
            console.log(e)
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyToken = async (id) => {
        return await keytokenModel.findOneAndRemove(id)
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshTokenUsed: refreshToken })
    }

    static deleteKeyById = async (userId) => {
        console.log('objectkeyyy',new Types.ObjectId(userId))
        return await keytokenModel.deleteOne({ user: new Types.ObjectId(userId) })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne({ refreshToken })
    }
}

module.exports = KeyTokenService