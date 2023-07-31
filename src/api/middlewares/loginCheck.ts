import { ReqHandler } from "../helper/types"
import getInstanceForReq from "../service/instance"

export const loginVerification : ReqHandler = (req, res, next) => {
    const key = req.query['key']?.toString()
    if (!key) {
        return res
            .status(403)
            .send({ error: true, message: 'no key query was present' })
    }
    const instance = getInstanceForReq(req)
    if (!instance.instance?.online) {
        return res
            .status(401)
            .send({ error: true, message: "phone isn't connected" })
    }
    next()
}

export default loginVerification
