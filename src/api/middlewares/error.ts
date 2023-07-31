/* eslint-disable no-unused-vars */
import APIError from '../../api/errors/api.error'
import { ErrHandler, ReqHandler } from '../helper/types'

export const handler : ErrHandler = (err, req, res, next) => {
    const statusCode = err.status ? err.status : 500

    res.setHeader('Content-Type', 'application/json')
    res.status(statusCode)
    res.json({
        error: true,
        code: statusCode,
        message: err.message,
    })
}

export const notFound : ReqHandler = (req, res, next) => {
    const err = new APIError({
        message: 'Not found',
        status: 404,
    })
    return handler(err, req, res, next)
}
