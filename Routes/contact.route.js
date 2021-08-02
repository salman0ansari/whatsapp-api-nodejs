const router = require('express').Router();

router.get('/getprofilepic/:phone', async (req, res) => {
    let phone = req.params.phone;

    if (phone != undefined) {
        client.getProfilePicture(`${phone}@c.us`).then((ppUrl) => {
            if (ppUrl) {
                res.send({ status: 'success', message: ppUrl });
            } else {
                res.send({ status: 'error', message: 'Not Found' });
            }
        })
    }
});

module.exports = router;