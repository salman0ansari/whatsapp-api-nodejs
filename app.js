const express = require("express");
const fs = require('fs');
const {
    WAConnection,
    Browsers
} = require('@adiwajshing/baileys');
const chatRoute = require('./Routes/chat.route');
global.client = new WAConnection();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

fs.existsSync('./auth_info.json') && client.loadAuthInfo('./auth_info.json')
client.on('qr',async ()  => {
        const authInfo = await client.base64EncodedAuthInfo()
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'))
})

client.on('chats-received', () => {
    console.log('Client is ready!');
});

client.connect()

app.use(function(req, res, next){
    console.log(req.method + ' : ' + req.path);
    next();
});

app.use('/chat',chatRoute);

app.listen(port, () => {
    console.log("Server Running Live on Port : " + port);
});