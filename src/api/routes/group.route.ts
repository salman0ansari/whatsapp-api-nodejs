const express = require('express')
const controller = require('../controllers/group.controller')
const keyVerify = require('../middlewares/keyCheck')
const loginVerify = require('../middlewares/loginCheck')

const router = express.Router()

router.route('/create').post(keyVerify, loginVerify, controller.create)
router.route('/listall').get(keyVerify, loginVerify, controller.listAll)
router.route('/leave').get(keyVerify, loginVerify, controller.leaveGroup)

router
    .route('/inviteuser')
    .post(keyVerify, loginVerify, controller.addNewParticipant)
router.route('/makeadmin').post(keyVerify, loginVerify, controller.makeAdmin)
router
    .route('/demoteadmin')
    .post(keyVerify, loginVerify, controller.demoteAdmin)
router
    .route('/getinvitecode')
    .get(keyVerify, loginVerify, controller.getInviteCodeGroup)
router
    .route('/getinstanceinvitecode')
    .get(keyVerify, loginVerify, controller.getInstanceInviteCodeGroup)
router
    .route('/getallgroups')
    .get(keyVerify, loginVerify, controller.getAllGroups)
router
    .route('/participantsupdate')
    .post(keyVerify, loginVerify, controller.groupParticipantsUpdate)
router
    .route('/settingsupdate')
    .post(keyVerify, loginVerify, controller.groupSettingUpdate)
router
    .route('/updatesubject')
    .post(keyVerify, loginVerify, controller.groupUpdateSubject)
router
    .route('/updatedescription')
    .post(keyVerify, loginVerify, controller.groupUpdateDescription)
router
    .route('/inviteinfo')
    .post(keyVerify, loginVerify, controller.groupInviteInfo)
router.route('/groupjoin').post(keyVerify, loginVerify, controller.groupJoin)
module.exports = router
