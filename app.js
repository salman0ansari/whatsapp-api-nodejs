require('dotenv').config()
const express = require("express");
const fs = require('fs');
const {
    WAConnection,
    Browsers
} = require('@adiwajshing/baileys');

// routes
const contactRoute = require('./Routes/contact.route');
const chatRoute = require('./Routes/chat.route');


global.client = new WAConnection();
client.logger.level = 'warn';

(function () {
    if(!fs.existsSync('.env')) {
        console.log('==> No API_KEY Found')
        console.log('==> Creating New')
        key = require('crypto').randomBytes(64).toString('base64').replace(/[^A-Za-z0-9]/g, "").substring(0,32)
        fs.writeFileSync('.env', `API_KEY=${key}`)
        console.log(`==> Key Created : ${key}`)
        console.log(`==> Use This Key For Authentication`)}
    else{
        console.log(`==> API Key Found : ${process.env.API_KEY}`)
    }
})();


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

fs.existsSync('./auth_info.json') && client.loadAuthInfo('./auth_info.json')
client.on('open', async ()  => {
        const authInfo = await client.base64EncodedAuthInfo()
        fs.writeFileSync('./auth_info.json', JSON.stringify(authInfo, null, '\t'))
})

client.on('connecting', () => {
    console.log(`==> Connecting to Client`)
})

client.on('chats-received', () => {
    console.log('==> Client is ready!');
});

client.connect()

app.use(function(req, res, next){
    console.log("==> " + req.method + ' : ' + req.path);
    next();
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key')
    next()
  })

app.use((req, res, next) => {
    const apiKey = req.get('API-Key')
    if (!apiKey || apiKey !== process.env.API_KEY) {
      res.status(401).send({statis: 'unauthorised', message: "Invaild or Missing Key"})
    } else {
      next()
    }
  })

app.use('/chat',chatRoute);
app.use('/contact',contactRoute);

app.use('*', (req,res) =>{
    res.status(404).send({status : "error",message : "Page Not Found!"});
});

app.listen(port, () => {
    console.log(`==> Server Running Live on Port : ${port}`);
});