const router = require('express').Router();
const {Mimetype, MessageType} = require('@adiwajshing/baileys');

router.post('/sendmessage/:phone', async (req,res) => {
    let phone = req.params.phone;
    let message = req.body.message;

    if (phone == undefined || message == undefined) {
        res.send({ status:"error", message:`Please enter valid phone and message`})
    } else {
        await client.sendMessage(phone + '@c.us', message, MessageType.text).then((response) => {
            if (response.key.fromMe) {
                res.send({ status:'success', message: `MessageType.text successfully sent to ${phone}` })
            }
        });
    }
});

router.post('/sendlocation/:phone', async (req, res) => {
    let phone = req.params.phone;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;

    if (phone == undefined || latitude == undefined || longitude == undefined) { 
        res.send({ status: "error", message: "Please enter valid phone, latitude and longitude" })
    } else {
        let location = {degreesLatitude: latitude, degreeslongitude: longitude};
        client.sendMessage(`${phone}@c.us`, location, MessageType.location).then((response)=>{
            if (response.key.fromMe) {
                res.send({ status: 'success', message: `MessageType.location successfully sent to ${phone}` })
            }
        });
    }
});

// TODO : add pagination
router.get('/getchatbyid/:phone', async (req, res) => {
    let phone = req.params.phone;
    if (phone == undefined) {
        res.send({status:"error",message:"Please enter valid phone number"});
    } else {
        client.loadMessages(`${phone}@c.us`).then((chat) => {
            res.send({ status:"success", message: chat });
        }).catch(() => {
            console.error("getchaterror")
            res.send({ status: "error", message: "getchaterror" })
        })
    }
});

// 13476672301

router.get('/getchats', async (req, res) => {
    await client.getChats().then(() => {
        res.send({ status: "success", message: client.chats});
    }).catch(() => {
        res.send({ status: "error",message: "getchatserror" })
    })
});

module.exports = router;