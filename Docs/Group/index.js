const group = require("./group")
const allGroup = require("./allGroups")
const adminGroupWithParticipant = require("./adminGroupWithParticiapants")
const adminGroups = require("./adminGroups")
const addParticipant = require("./addParticipant")

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
        }
}