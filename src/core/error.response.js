'use strict'

const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode")

const StatusCode = {
    FORBIDDEN : 403,
    CONFLICT : 409
}

const ReasonStatusCode = {
    FORBIDDEN : 'Bad request error',
    CONFLICT : 'Conflict error'
}
class ErrorMessage extends Error{
    constructor(message,status){
        super(message)
        this.status = status
    }
}

class ConflixRequestError extends ErrorMessage{
    constructor(message = ReasonStatusCode.CONFLICT,statusCode = StatusCode.CONFLICT){
        super(message,statusCode)
    }
}

class BadRequestError extends ErrorMessage{
    constructor(message = ReasonStatusCode.FORBIDDEN,statusCode = StatusCode.FORBIDDEN){
        super(message,statusCode)
    }
}

class AuthFailureError extends ErrorMessage{
    constructor({message  = ReasonPhrases.UNAUTHORIZED,statusCode = StatusCodes.UNAUTHORIZED}){
        super(message,statusCode)
    }
}
class NotFoundError extends ErrorMessage{
    constructor({message  = ReasonPhrases.NOT_FOUND,statusCode = StatusCodes.NOT_FOUND}){
        super(message,statusCode)
    }
}
module.exports = {
    ConflixRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError
}