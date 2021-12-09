const router = require('express').Router()
const InstanceKeyVerification = require("../Middleware/keyVerify")
const InstanceLoginVerification = require("../Middleware/loginVerify")

router.get('/group', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.getGroupFromId(req.query.id)
    if(data.error) return res.status(404).json(data)
    return res.status(201).json({
        groupData: data
    });
})

router.get('/allGroup', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.getAllGroups();
    return res.status(201).json({
        groupsData: data
    });
})

router.get('/adminGroups', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.getAdminGroups(false);
    return res.status(201).json(data);
})

router.get('/adminGroupsWithParticipants', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.getAdminGroups(true);
    return res.status(201).json({data});
})

router.post('/addParticipant', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.addNewParticipant(req.body.data);
    if(data.error) return res.status(401).json(data)
    return res.status(201).json(data);
})

router.post('/makeAdmin', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.makeAdmin(req.body.data);
    if(data.error) return res.status(401).json(data)
    return res.status(201).json(data);
})

router.delete('/demoteAdmin', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.demoteAdmin(req.body.data);
    if(data.error) return res.status(401).json(data)
    return res.status(201).json(data);
})

router.post('/createGroup', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.createNewGroup(req.body.data);
    if(data.error) return res.status(401).json(data)
    return res.status(201).json(data);
})


router.delete('/leaveGroup', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.leaveGroup(req.query.id);
    if(data.error) return res.status(401).json(data)
    return res.status(201).json(data);
})


router.get('/groupInviteCode', InstanceKeyVerification, InstanceLoginVerification, async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    const data = await instance.getInviteCodeOfGroup(req.query.id);
    if (data.error) return res.status(401).json(data)
    return res.status(201).json(data);
})



module.exports = router;