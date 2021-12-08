const group = require("./group")
const allGroup = require("./allGroups")
const adminGroupWithParticipant = require("./adminGroupWithParticiapants")
const adminGroups = require("./adminGroups")
const addParticipant = require("./addParticipant")
const makeAdmin = require("./makeAdmin")
const demoteAdmin = require("./demoteAdmin")

module.exports = {
        '/group':{
            ...group
        },
        '/allGroup':{
            ...allGroup
        },
        '/adminGroups':{
            ...adminGroups
        },
        '/adminGroupsWithParticipants':{
            ...adminGroupWithParticipant
        },
        '/addParticipant':{
            ...addParticipant
        },
        '/makeAdmin':{
            ...makeAdmin
        },
        '/demoteAdmin':{
            ...demoteAdmin
        }
}