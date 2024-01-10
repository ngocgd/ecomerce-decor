'use strict';

const JWT = require('jsonwebtoken');
const { asyncHandleError } = require('./checkAuth');
const { asyncHandler } = require('../helpers/asyncHandler');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const { findByUserId } = require('../services/keyToken.service');
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESH_TOKEN: 'refresh-token'
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        })
        const refreshToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify', err)
            } else {
                console.log('decode verify ', decode)
            }
        })
        return { accessToken, refreshToken, publicKey, privateKey }
    } catch (error) {
        console.log(error)
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /*
    
    */
    try {
        const userId = req.headers[HEADER.CLIENT_ID]
        if (!userId) throw new AuthFailureError('Invalid request')

        const keyStore = await findByUserId(userId)
        if (!keyStore) {
            throw new NotFoundError('Not found keyStore')
        }
        //3
        if (req.headers[HEADER.REFRESH_TOKEN]) {
            try {
                const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
                const decodeUser = await JWT.verify(refreshToken, keyStore.publicKey)
                if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
                req.keyStore = keyStore
                req.user = decodeUser
                req.refreshToken = refreshToken
                return next()
            } catch (err) {
                console.log(err)
                throw err
            }
        }

        const accessToken = req.headers[HEADER.AUTHORIZATION]
        if (!accessToken) throw new AuthFailureError('Invalid request')

        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) {
            throw new AuthFailureError('Invalid User')
        }
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (e) {
        console.log('eeeeeeeeee',e)
        throw new Error(e)
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)

}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT
}