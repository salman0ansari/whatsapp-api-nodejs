const express = require("express");
const app = express()
const fileupload = require("express-fileupload")
app.use(fileupload())

app.set('view engine', 'ejs');
app.set('views','./Views')
app.use(express.static('./Views'));
app.use(express.urlencoded({ extended: false }))

app.use(express.Router())

const Instance = require("./Routes/Instance")
app.use(Instance);

const server = app.listen(process.env.PORT || 3333, () => console.log(`Listening on PORT => ${server.address().port}`))
