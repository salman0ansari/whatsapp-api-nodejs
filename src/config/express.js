const express = require("express");
const path = require("path");
const exceptionHandler = require('express-exception-handler')
exceptionHandler.handle()
const app = express()
const error = require("../api/middlewares/error")

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../api/views'))
// app.use(express.static(path.join(__dirname, 'public')));
global.WhatsAppInstances = {};

const routes = require('../api/routes/index');
app.use('/', routes);
app.use(error.handler)

module.exports = app;
