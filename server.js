const express = require("express");
const app = express()
const fileupload = require("express-fileupload")
const Logger = require("./Middleware/logger")

app.use(Logger)
app.use(fileupload())
app.set('view engine', 'ejs');
app.set('views','./Views')
app.use(express.static('./Views'));
app.use(express.urlencoded({ extended: false }))
app.use(express.Router())

const Instance = require("./Routes/Instance")
app.use(Instance);

app.get('*',(req, res) => {
    res.status(404).send({
        error: true,
        message: "404 not found"
    });
})

const server = app.listen(process.env.PORT || 3333, () => console.log(`📗: Listening on PORT => http://localhost:${server.address().port}`))


