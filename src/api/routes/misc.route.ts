import express from 'express'
import * as controller from '../controllers/misc.controller'
import keyVerify from '../middlewares/keyCheck'
import loginVerify from '../middlewares/loginCheck'

const router = express.Router()

router.route('/onwhatsapp').get(keyVerify, loginVerify, controller.onWhatsapp)
router.route('/downProfile').get(keyVerify, loginVerify, controller.downProfile)
router.route('/getStatus').get(keyVerify, loginVerify, controller.getStatus)
router.route('/blockUser').get(keyVerify, loginVerify, controller.blockUser)
router.route('/updateProfilePicture').post(keyVerify, loginVerify, controller.updateProfilePicture)
router.route('/getuserorgroupbyid').get(keyVerify, loginVerify, controller.getUserOrGroupById)

export default router
