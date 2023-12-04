'use strict'

const { CREATED, SuccessResponse } = require("../core/sucess.response");
const AccessService = require("../services/access.service");


class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body),
        }).send(res)
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout success',
            metadata: await AccessService.logout({ keyStore: req.keyStore }),
        }).send(res)
    }
    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get Token success',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        new SuccessResponse({
            message: 'Get Token success',
            metadata: await AccessService.handlerRefreshTokenV2({ refreshToken: req.refreshToken, user: req.user, keyStore: req.keyStore })
        }).send(res)
    }
}

module.exports = new AccessController();