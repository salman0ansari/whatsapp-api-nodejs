const router = require('express').Router();
const {Mimetype, MessageType } = require('@adiwajshing/baileys');
const vuri = require('valid-url')
const fs = require('fs');


const mediaDownloader = function(uri, filename,callback) {
    let request = require('request');
    request.head(uri, function(err, res, body) {
    res.headers['content-type']
    res.headers['content-length']
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    })};

    
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


router.get('/getchats', async (req, res) => {
    await client.getChats().then(() => {
        res.send({ status: "success", message: client.chats});
    }).catch(() => {
        res.send({ status: "error",message: "getchatserror" })
    })
});


router.post('/sendimage/:phone', async (req,res) => {
    let base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    let phone = req.params.phone;
    let image = req.body.image;
    let caption = req.body.caption;

    if (phone == undefined || image == undefined) {
        res.send({ status: "error", message: "please enter valid phone and base64/url of image" })
    } else {
        if (base64regex.test(image)) {
            try {
                let buffer = Buffer.from(image, 'base64')
            await client.sendMessage(`${phone}@c.us`, buffer, MessageType.image, { caption: caption || '' }).then((response) => {
                if (response.key.fromMe) {
                    res.send({ status: 'success', message: `MessageType.image successfully sent to ${phone}` })
                }
            });
            } catch (error) {
                res.send({ status: 'error', message: `${error}` })
            }
            
        } else if (vuri.isWebUri(image)) {
            if (!fs.existsSync('./temp')) {
                await fs.mkdirSync('./temp');
            }
            let fileName = './temp/' + image.split("/").slice(-1)[0]
            mediaDownloader(image, fileName ,async () => {
                await client.sendMessage(`${phone}@c.us`, {url : image}, MessageType.image, {caption: caption || '' }).then((response) => {
                    if (response.key.fromMe) {
                        res.send({ status: 'success', message: `MessageType.image successfully sent to ${phone}` })
                        fs.unlinkSync(fileName) // delete file after send
                    }
                });
            })
        } else {
            res.send({ status:'error', message: 'Invalid URL/Base64 Encoded Media' })
        }
    }
});

module.exports = router;
