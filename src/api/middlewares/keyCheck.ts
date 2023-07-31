import { ReqHandler } from "../helper/types"
import getInstanceForReq from "../service/instance"

export const keyVerification : ReqHandler = (req, res, next) => {
    const key = req.query['key']?.toString()
    if (!key) {
        return res
            .status(403)
            .send({ error: true, message: 'no key query was present' })
    }
    const instance = getInstanceForReq(req)
    if (!instance) {
        return res
            .status(403)
            .send({ error: true, message: 'invalid key supplied' })
    }
    next()
}

export default keyVerification
